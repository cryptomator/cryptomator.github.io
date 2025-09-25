'use strict';

class HubSetup {

  /**
   * The pre-filled config values before being customized by the user
   * @returns default config
   */
  static defaultConfig() {
    return {
      compose: {
        includeTraefik: false,
        publicNetwork: 'srv'
      },
      k8s: {
        namespace: 'default',
        includeIngress: false
      },
      db: {
        adminPw: HubSetup.uuid(),
        keycloakPw: HubSetup.uuid(),
        hubPw: HubSetup.uuid(),
      },
      keycloak: {
        useExternal: false,
        publicUrl: 'https://domain.tld/kc',
        adminUser: 'admin',
        adminPw: 'admin',
        realmId: 'cryptomator',
      },
      hub: {
        version: 'stable',
        publicUrl: 'https://domain.tld',
        adminUser: 'admin',
        adminPw: 'admin',
        systemClientSecret: HubSetup.uuid(),
      }
    }
  }

  /**
   * Generate output with all config files
   * @param {*} cfg The customized config
   * @returns output
   */
  static generateOutput(cfg) {
    return {
      k8s: HubSetup.writeHeader(cfg) + HubSetup.writeK8sConfig(cfg),
      compose: HubSetup.writeHeader(cfg) + HubSetup.writeComposeConfig(cfg),
      realm: HubSetup.writeRealmConfig(cfg)
    }
  }

  /**
   * Create a Docker Compose file
   * @param {*} cfg The customized config
   * @returns docker-compose.yml content
   */
  static writeComposeConfig(cfg) {
    try {
      return new DockerComposeConfigBuilder(cfg).build();
    } catch (e) {
      return `---
GENERATING CONFIG FAILED
---
${e}`;
    }
  }

  /**
   * Create a Kubernetes file
   * @param {*} cfg The customized config
   * @returns k8s-hub.yml content
   */
  static writeK8sConfig(cfg) {
    try {
      return new KubernetesConfigBuilder(cfg).build();
    } catch (e) {
      return `---
GENERATING CONFIG FAILED
---
${e}`;
    }
  }

  /**
   * Create a realm file for Keycloak
   * @param {*} cfg The customized config
   * @returns realm.json content
   */
  static writeRealmConfig(cfg) {
    try {
      let realmCfg = new ConfigBuilder(cfg).getRealmConfig();
      return JSON.stringify(realmCfg, null, 2);
    } catch (e) {
      return `---
GENERATING CONFIG FAILED
---
${e}`;
    }
  }

  static writeHeader(cfg) {
    let cfgBuilder = new ConfigBuilder(cfg);
    let devMode = cfgBuilder.getHostname(cfg.keycloak.publicUrl) == 'localhost';
    let defaultKeycloakPath = cfgBuilder.getPathname(cfg.keycloak.publicUrl) == '/kc';

    let result = '# Template for Cryptomator Hub deployment according to your specifications.\n\n';

    if (!devMode && defaultKeycloakPath) {
      result += '# If for some reason you later change any of the following environment variables, make sure to remove `--optimized` from the keycloak command, otherwise it will not start:\n';
      result += '#  * KC_DB\n#  * KC_HEALTH_ENABLED\n#  * KC_HTTP_RELATIVE_PATH\n\n';
    }

    result += '# Generated using script version 7\n\n';

    return result;
  }

  static uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static getPort(urlStr) {
    try {
      let url = new URL(urlStr);
      let port = Number.parseInt(url.port);
      let defaultPort = (url.protocol == 'https:') ? 443 : 80;
      return Number.isNaN(port) ? defaultPort : port;
    } catch {
      return -1;
    }
  }

  static urlWithTrailingSlash(urlStr) {
    try {
      let url = new URL(urlStr);
      if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
      }
      return url.href;
    } catch {
      return '<invalid-url>';
    }
  }

}

/**
 * Base class for config builders
 */
class ConfigBuilder {

  constructor(cfg) {
    this.cfg = cfg;
  }

  getPort(urlStr) {
    let url = new URL(urlStr);
    let port = Number.parseInt(url.port);
    let defaultPort = (url.protocol == 'https:') ? 443 : 80;
    return Number.isNaN(port) ? defaultPort : port;
  }

  getHostname(urlStr) {
    let url = new URL(urlStr);
    return url.hostname;
  }

  getPathname(urlStr) {
    let url = new URL(urlStr);
    return url.pathname;
  }

  getPathnameWithTrailingSlash(urlStr) {
    let url = new URL(urlStr);
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    return url.pathname;
  }

  getInitDbSQL() {
    let sql = [];
    if (!this.cfg.keycloak.useExternal) {
      sql.push(`CREATE USER keycloak WITH ENCRYPTED PASSWORD '${this.cfg.db.keycloakPw}';
CREATE DATABASE keycloak WITH ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;`)
    }
    sql.push(`CREATE USER hub WITH ENCRYPTED PASSWORD '${this.cfg.db.hubPw}';
CREATE DATABASE hub WITH ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE hub TO hub;`);
    return sql.join('\n');
  }

  getRealmConfig() {
    return {
      id: crypto.randomUUID(),
      realm: this.cfg.keycloak.realmId,
      displayName: 'Cryptomator Hub', // TODO make configurable?
      loginTheme: 'cryptomator',
      enabled: true,
      sslRequired: 'external',
      defaultRole: {
        name: "user",
        description: "User"
      },
      roles: {
        realm: [
          {
            name: 'user',
            description: 'User',
            composite: false
          },
          {
            name: 'create-vaults',
            description: 'Can create vaults',
            composite: false
          },
          {
            name: 'admin',
            description: 'Administrator',
            composite: true,
            composites: {
              realm: ['user', 'create-vaults'],
              client: {
                'realm-management': ['realm-admin']
              }
            }
          }
        ],
      },
      users: [
        {
          username: this.cfg.hub.adminUser,
          enabled: true,
          credentials: [{ type: 'password', value: this.cfg.hub.adminPw, temporary: true }],
          requiredActions: ['UPDATE_PASSWORD'],
          realmRoles: ['admin']
        },
        {
          username: 'system',
          email: "system@localhost",
          enabled: true,
          serviceAccountClientId: "cryptomatorhub-system",
          clientRoles: { 'realm-management' : ['realm-admin'] }
        }
      ],
      scopeMappings: [
        {
          client: 'cryptomatorhub',
          roles: ['user', 'admin']
        }
      ],
      clients: [{
        clientId: 'cryptomatorhub',
        serviceAccountsEnabled: false,
        publicClient: true,
        name: 'Cryptomator Hub',
        enabled: true,
        redirectUris: [
          new URL('*', HubSetup.urlWithTrailingSlash(this.cfg.hub.publicUrl)).href
        ],
        webOrigins: ['+'],
        bearerOnly: false,
        frontchannelLogout: false,
        protocol: 'openid-connect',
        attributes: { 'pkce.code.challenge.method': 'S256' },
        protocolMappers: [
          {
            name: 'realm roles',
            protocol: 'openid-connect',
            protocolMapper: 'oidc-usermodel-realm-role-mapper',
            consentRequired: false,
            config: {
              'access.token.claim': 'true',
              'claim.name': 'realm_access.roles',
              'jsonType.label': 'String',
              multivalued: 'true'
            }
          },
          {
            name: 'client roles',
            protocol: 'openid-connect',
            protocolMapper: 'oidc-usermodel-client-role-mapper',
            consentRequired: false,
            config: {
              'access.token.claim': 'true',
              'claim.name': 'resource_access.${client_id}.roles',
              'jsonType.label': 'String',
              multivalued: 'true'
            }
          }
        ],
      },
      {
        clientId: 'cryptomator',
        serviceAccountsEnabled: false,
        publicClient: true,
        name: 'Cryptomator App',
        enabled: true,
        redirectUris: [
          'http://127.0.0.1/*',
          'org.cryptomator.ios:/hub/auth',
          'org.cryptomator.android:/hub/auth'
        ],
        webOrigins: ['+'],
        bearerOnly: false,
        frontchannelLogout: false,
        protocol: 'openid-connect',
        attributes: { 'pkce.code.challenge.method': 'S256' },
      },
      {
        clientId: 'cryptomatorhub-system',
        serviceAccountsEnabled: true,
        publicClient: false,
        name: 'Cryptomator Hub System',
        enabled: true,
        clientAuthenticatorType: 'client-secret',
        secret: this.cfg.hub.systemClientSecret,
        standardFlowEnabled: false,
      }],
      browserSecurityHeaders: {
        contentSecurityPolicy: `frame-src 'self'; frame-ancestors 'self' ${HubSetup.urlWithTrailingSlash(this.cfg.hub.publicUrl)}; object-src 'none';`
      }
    };
  }

}

/**
 * A ConfigBuilder building a Docker Compose file.
 */
class DockerComposeConfigBuilder extends ConfigBuilder {

  constructor(cfg) {
    super(cfg);
  }

  /**
   * Create a Docker Compose file
   * @returns docker-compose.yml content
   */
  build() {
    return jsyaml.dump({
      ...(this.cfg.compose.includeTraefik) && { networks: {'hub-internal': {}}},
      services: {
        'init-config': this.getInitConfigService(),
        'postgres': this.getPostgresService(),
        ...(!this.cfg.keycloak.useExternal) && {'keycloak': this.getKeycloakService()},
        'hub': this.getHubService()
      },
      volumes: {
        ...(!this.cfg.keycloak.useExternal) && { 'kc-config': {} },
        'db-init': {},
        'db-data': {}
      }
    }, {lineWidth: -1});
  }

  getInitConfigService() {
    let writeInitDbCmd = `cat >/db-init/initdb.sql << 'EOF'
${this.getInitDbSQL()}
EOF`;
    if (!this.cfg.keycloak.useExternal) {
        // double-dollar sign is needed to be interpreted as literal dollar sign, see: https://docs.docker.com/compose/compose-file/#interpolation
        // replaceAll also requires double-dollar sign, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
        let writeRealmCmd = `cat >/kc-config/realm.json << 'EOF'
${JSON.stringify(this.getRealmConfig(), null, 2).replaceAll('$', '$$$$')}
EOF`;
        return {
          image: 'bash:5',
          volumes: ['kc-config:/kc-config', 'db-init:/db-init'],
          command: ['bash', '-c', writeInitDbCmd + '\n' + writeRealmCmd]
        }
    } else {
      return {
        image: 'bash:5',
        volumes: ['db-init:/db-init'],
        command: ['bash', '-c', writeInitDbCmd]
      }
    }
  }

  getPostgresService() {
    return {
      depends_on: {'init-config': {condition: 'service_completed_successfully'}},
      image: 'postgres:14-alpine',
      volumes: ['db-init:/docker-entrypoint-initdb.d', 'db-data:/var/lib/postgresql/data'],
      deploy: {
        resources: {
          limits: {cpus: '1.0', memory: '256M'}
        }
      },
      healthcheck: {
        test: ['CMD', 'pg_isready', '-U', 'postgres'],
        interval: '10s',
        timeout: '3s',
      },
      restart: 'unless-stopped',
      environment: {
        POSTGRES_PASSWORD: this.cfg.db.adminPw,
        POSTGRES_INITDB_ARGS: '--encoding=UTF8',
      },
      ...(this.cfg.compose.includeTraefik && {
        networks: ['hub-internal'],
        labels: ['traefik.enable=false']
      })
    }
  }

  getKeycloakService() {
    let devMode = this.getHostname(this.cfg.keycloak.publicUrl) == 'localhost';
    let defaultKeycloakPath = this.getPathname(this.cfg.keycloak.publicUrl) == '/kc';
    let startCmd;
    if (devMode) {
      startCmd = 'start-dev --import-realm'; // dev mode (no TLS required)
    } else if (defaultKeycloakPath) {
      startCmd = 'start --optimized --import-realm'; // prod mode using build time optimizations (requires a proper TLS termination proxy)
    } else {
      startCmd = 'start --import-realm';  // prod mode without build time optimizations (requires a proper TLS termination proxy)
    }
    return {
      depends_on: {
        'init-config': {condition: 'service_completed_successfully'},
        'postgres': {condition: 'service_healthy'}
      },
      image: 'ghcr.io/cryptomator/keycloak:26.3.5',
      command: startCmd,
      volumes: ['kc-config:/opt/keycloak/data/import'],
      deploy: {
        resources: {
          limits: {cpus: '1.0', memory: '1024M'}
        }
      },
      ...(!this.cfg.compose.includeTraefik && {ports: [`${this.getPort(this.cfg.keycloak.publicUrl)}:8080`]}),
      healthcheck: {
        test: ['CMD', 'curl', '-f', `http://localhost:9000${this.getPathname(HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl))}health/live`],
        interval: '60s',
        timeout: '3s',
      },
      restart: 'unless-stopped',
      environment: {
        KEYCLOAK_ADMIN: this.cfg.keycloak.adminUser,
        KEYCLOAK_ADMIN_PASSWORD: this.cfg.keycloak.adminPw,
        KC_DB: 'postgres',
        KC_DB_URL: 'jdbc:postgresql://postgres:5432/keycloak',
        KC_DB_USERNAME: 'keycloak',
        KC_DB_PASSWORD: this.cfg.db.keycloakPw,
        KC_HEALTH_ENABLED: 'true',
        KC_HOSTNAME: devMode ? null : 'https://' + this.getHostname(this.cfg.keycloak.publicUrl),
        // KC_HOSTNAME_PORT: devMode ? null : this.getPort(this.cfg.keycloak.publicUrl), // FIXME as string!! FIXME does not work at all!!
        KC_HTTP_ENABLED: 'true',
        KC_PROXY_HEADERS: 'xforwarded',
        KC_HTTP_RELATIVE_PATH: this.getPathname(this.cfg.keycloak.publicUrl),
      },
      ...(this.cfg.compose.includeTraefik && this.getTraefikConfig(this.cfg.keycloak.publicUrl, 'kc'))
    }
  }

  getHubService() {
    return {
      depends_on: {
        ...(!this.cfg.keycloak.useExternal) && { 'keycloak': {condition: 'service_healthy'} },
        'postgres': {condition: 'service_healthy'}
      },
      image: `ghcr.io/cryptomator/hub:${this.cfg.hub.version}`,
      deploy: {
        resources: {
          limits: {cpus: '1.0', memory: '512M'}
        }
      },
      ...(!this.cfg.compose.includeTraefik && {ports: [`${this.getPort(this.cfg.hub.publicUrl)}:8080`]}),
      healthcheck: {
        test: ['CMD-SHELL', '(curl -f http://localhost:9000/q/health/live && curl -f http://localhost:8080/api/config) || exit 1'],
        interval: '10s',
        timeout: '3s',
      },
      restart: 'unless-stopped',
      environment: {
        HUB_PUBLIC_ROOT_PATH: this.getPathnameWithTrailingSlash(this.cfg.hub.publicUrl),
        HUB_KEYCLOAK_PUBLIC_URL: this.cfg.keycloak.publicUrl,
        HUB_KEYCLOAK_LOCAL_URL: !this.cfg.keycloak.useExternal ? `http://keycloak:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl,
        HUB_KEYCLOAK_REALM: this.cfg.keycloak.realmId,
        HUB_KEYCLOAK_SYSTEM_CLIENT_ID: 'cryptomatorhub-system',
        HUB_KEYCLOAK_SYSTEM_CLIENT_SECRET: this.cfg.hub.systemClientSecret,
        HUB_KEYCLOAK_SYNCER_PERIOD: '5m', // TODO make configurable?
        HUB_KEYCLOAK_OIDC_CRYPTOMATOR_CLIENT_ID: 'cryptomator',
        QUARKUS_OIDC_AUTH_SERVER_URL: new URL(`realms/${this.cfg.keycloak.realmId}`, HubSetup.urlWithTrailingSlash(!this.cfg.keycloak.useExternal ? `http://keycloak:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl)).href, // network-internal URL
        QUARKUS_OIDC_TOKEN_ISSUER: new URL(`realms/${this.cfg.keycloak.realmId}`, HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)).href,
        QUARKUS_OIDC_CLIENT_ID: 'cryptomatorhub',
        QUARKUS_DATASOURCE_JDBC_URL: 'jdbc:postgresql://postgres:5432/hub',
        QUARKUS_DATASOURCE_USERNAME: 'hub',
        QUARKUS_DATASOURCE_PASSWORD: this.cfg.db.hubPw,
        QUARKUS_HTTP_PROXY_PROXY_ADDRESS_FORWARDING: true,
        QUARKUS_HTTP_HEADER__CONTENT_SECURITY_POLICY__VALUE: `default-src 'self'; connect-src 'self' api.cryptomator.org ${HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)}; object-src 'none'; child-src 'self'; img-src * data:; frame-ancestors 'none'`
      },
      ...(this.cfg.compose.includeTraefik && this.getTraefikConfig(this.cfg.hub.publicUrl, 'hub')),
    }
  }

  getTraefikConfig(publicUrl, service) {
    let hostname = this.getHostname(publicUrl);
    let path = this.getPathname(publicUrl)
    let traefikRule = `traefik.http.routers.${service}.rule=Host(\`${hostname}\`)`;
    if (path != '/') {
      traefikRule += ` && PathPrefix(\`${path}\`)`;
    }
    return {
      networks: [this.cfg.compose.publicNetwork, 'hub-internal'],
      labels: ['traefik.enable=true', traefikRule, `traefik.http.services.${service}.loadbalancer.server.port=8080`]
    };
  }

}

/**
 * A ConfigBuilder building a Kubernetes deployment descriptor.
 */
class KubernetesConfigBuilder extends ConfigBuilder {

  constructor(cfg) {
    super(cfg);
  }

  /**
   * Create a Kubernetes deployment descriptor
   * @returns k8s-hub.yml content
   */
   build() {
    let result = '';

    // Namespace
    if (this.cfg.k8s.namespace != 'default') {
      result += '# Namespace\n'
      result += jsyaml.dump({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {name: this.cfg.k8s.namespace }
      }, {lineWidth: -1});
      result += '\n---\n'
    }

    // Secrets
    result += '# Configuration\n'
    result += this.getSecrets();
    result += '\n---\n'

    // PVCs
    result += '# PVCs\n'
    result += this.getPVCs();
    result += '\n---\n'

    // Postgres Deployment
    result += '# Postgres\n'
    result += this.getPostgresDeployment();
    result += '\n---\n'

    // Keycloak Deployment
    if (!this.cfg.keycloak.useExternal) {
      result += '# Keycloak\n'
      result += this.getKeycloakDeployment();
      result += '\n---\n'
    }

    // Hub Deployment
    result += '# Cryptomator Hub\n'
    result += this.getHubDeployment();
    result += '\n---\n'

    // Services
    result += '# Services \n'
    result += this.getHubService();
    result += '\n---\n'
    if (!this.cfg.keycloak.useExternal) {
      result += this.getKeycloakService();
      result += '\n---\n'
    }
    result += this.getPostgresService();
    result += '\n---\n'

    // Ingress
    if (this.cfg.k8s.includeIngress) {
      result += '# Ingress\n'
      result += this.getIngress();
      result += '\n---\n'
    }

    return result;
  }

  getSecrets() {
    let realmCfg = this.getRealmConfig();
    let configMap = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'hub-secrets'},
      type: 'Opaque',
      stringData: {
        ...(!this.cfg.keycloak.useExternal) && { 'kc_admin_user': this.cfg.keycloak.adminUser },
        ...(!this.cfg.keycloak.useExternal) && { 'kc_admin_pass': this.cfg.keycloak.adminPw },
        'db_admin_pass': this.cfg.db.adminPw,
        'db_hub_pass': this.cfg.db.hubPw,
        ...(!this.cfg.keycloak.useExternal) && { 'db_kc_pass': this.cfg.db.keycloakPw },
        'hub_system_client_secret': this.cfg.hub.systemClientSecret,
        'initdb.sql': this.getInitDbSQL(),
        ...(!this.cfg.keycloak.useExternal) && { 'realm.json': JSON.stringify(realmCfg, null, 2) }
      }
    }
    return jsyaml.dump(configMap, {lineWidth: -1});
  }

  getPVCs() {
    let pvcs = {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'dbdata-pvc'},
      spec: {
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {storage: '1G'}
        }
      }
    }
    return jsyaml.dump(pvcs, {lineWidth: -1});
  }

  getHubDeployment() {
    let deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {name: 'cryptomator-hub', namespace: this.cfg.k8s.namespace, labels: {app: 'cryptomator-hub'}},
      spec: {
        replicas: 1,
        selector: {matchLabels: {app: 'cryptomator-hub'}},
        template: {
          metadata: {labels: {app: 'cryptomator-hub'}},
          spec: {
            initContainers: [{
              name: 'wait-for-postgres',
              image: 'busybox',
              args: [
                '/bin/sh',
                '-c',
                'set -x; while ! nc -zw 10 postgres-svc:5432; do echo "waiting for postgres..."; done'
              ]
            }, ...(!this.cfg.keycloak.useExternal ? [{
              name: 'wait-for-keycloak',
              image: 'busybox',
              args: [
                '/bin/sh',
                '-c',
                `set -x; while ! wget -q --spider "http://keycloak-svc:9000${this.getPathname(HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl))}health/live" 2>>/dev/null; do sleep 10; done`
              ]
            }] : [])],
            containers: [{
              name: 'cryptomator-hub',
              image: `ghcr.io/cryptomator/hub:${this.cfg.hub.version}`,
              imagePullPolicy: 'Always',
              ports: [{containerPort: 8080}],
              resources: {
                requests: {cpu: '25m', memory: '256Mi'},
                limits: {cpu: '1000m', memory: '512Mi'},
              },
              startupProbe: {
                httpGet: {path: '/q/health/started', port: 8080},
              },
              livenessProbe: {
                httpGet: {path: '/api/config', port: 8080}, httpGet: {path: '/api/config', port: 8080}, initialDelaySeconds: 10, periodSeconds: 3
              },
              readinessProbe: {
                httpGet: {path: '/q/health/ready', port: 8080}, httpGet: {path: '/api/config', port: 8080}, initialDelaySeconds: 10, periodSeconds: 3
              },
              env: [
                {name: 'HUB_PUBLIC_ROOT_PATH', value: this.getPathnameWithTrailingSlash(this.cfg.hub.publicUrl)},
                {name: 'HUB_KEYCLOAK_PUBLIC_URL', value: this.cfg.keycloak.publicUrl},
                {name: 'HUB_KEYCLOAK_LOCAL_URL', value: !this.cfg.keycloak.useExternal ? `http://keycloak-svc:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl},
                {name: 'HUB_KEYCLOAK_REALM', value: this.cfg.keycloak.realmId},
                {name: 'HUB_KEYCLOAK_SYSTEM_CLIENT_ID', value: 'cryptomatorhub-system'},
                {name: 'HUB_KEYCLOAK_SYSTEM_CLIENT_SECRET', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'hub_system_client_secret'}}},
                {name: 'HUB_KEYCLOAK_SYNCER_PERIOD', value: '5m'}, // TODO make configurable?
                {name: 'HUB_KEYCLOAK_OIDC_CRYPTOMATOR_CLIENT_ID', value: 'cryptomator'},
                {name: 'QUARKUS_OIDC_AUTH_SERVER_URL', value: new URL(`realms/${this.cfg.keycloak.realmId}`, HubSetup.urlWithTrailingSlash(!this.cfg.keycloak.useExternal ? `http://keycloak-svc:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl)).href},
                {name: 'QUARKUS_OIDC_TOKEN_ISSUER', value: new URL(`realms/${this.cfg.keycloak.realmId}`, HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)).href},
                {name: 'QUARKUS_OIDC_CLIENT_ID', value: 'cryptomatorhub'},
                {name: 'QUARKUS_DATASOURCE_JDBC_URL', value: 'jdbc:postgresql://postgres-svc:5432/hub'},
                {name: 'QUARKUS_DATASOURCE_USERNAME', value: 'hub'},
                {name: 'QUARKUS_DATASOURCE_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_hub_pass'}}},
                {name: 'QUARKUS_HTTP_PROXY_PROXY_ADDRESS_FORWARDING', value: 'true'},
                ...(this.cfg.keycloak.useExternal || this.getHostname(this.cfg.hub.publicUrl) != this.getHostname(this.cfg.keycloak.publicUrl) ? [{name: 'QUARKUS_HTTP_HEADER__CONTENT_SECURITY_POLICY__VALUE', value: `default-src 'self'; connect-src 'self' api.cryptomator.org ${HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)}; object-src 'none'; child-src 'self'; img-src * data:; frame-ancestors 'none'`}] : [])
              ]
            }]
          }
        }
      }
    };
    return jsyaml.dump(deployment, {lineWidth: -1});
  }

  // TODO: change to statefulset
  getPostgresDeployment() {
    let deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {name: 'postgres', namespace: this.cfg.k8s.namespace, labels: {app: 'postgres'}},
      spec: {
        replicas: 1,
        selector: {matchLabels: {app: 'postgres'}},
        template: {
          metadata: {labels: {app: 'postgres'}},
          spec: {
            containers: [{
              name: 'postgres',
              image: 'postgres:14-alpine',
              ports: [{containerPort: 5432}],
              resources: {
                requests: {cpu: '25m', memory: '64Mi'},
                limits: {cpu: '1000m', memory: '256Mi'},
              },
              livenessProbe: {
                exec: {command: ['pg_isready', '-U', 'postgres']},
              },
              env: [
                {name: 'POSTGRES_INITDB_ARGS', value: '--encoding=UTF8'},
                {name: 'POSTGRES_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_admin_pass'}}},
              ],
              volumeMounts: [
                {name: 'secrets-vol', mountPath: '/docker-entrypoint-initdb.d/initdb.sql', subPath: 'initdb.sql', readOnly: true},
                {name: 'dbdata-vol', mountPath: '/var/lib/postgresql/data', subPath: 'data'}
              ]
            }],
            volumes: [
              {
                name: 'secrets-vol',
                secret: {
                  secretName: 'hub-secrets'
                }
              },
              {
                name: 'dbdata-vol',
                persistentVolumeClaim: {claimName: 'dbdata-pvc'}
              }
            ]
          }
        }
      }
    };
    return jsyaml.dump(deployment, {lineWidth: -1});
  }

  getKeycloakDeployment() {
    let devMode = this.getHostname(this.cfg.keycloak.publicUrl) == 'localhost';
    let defaultKeycloakPath = this.getPathname(this.cfg.keycloak.publicUrl) == '/kc';
    let startCmd;
    if (devMode) {
      startCmd = ['/opt/keycloak/bin/kc.sh', 'start-dev', '--import-realm']; // dev mode (no TLS required)
    } else if (defaultKeycloakPath) {
      startCmd = ['/opt/keycloak/bin/kc.sh', 'start', '--optimized', '--import-realm']; // prod mode using build time optimizations (requires a proper TLS termination proxy)
    } else {
      startCmd = ['/opt/keycloak/bin/kc.sh', 'start', '--import-realm'];  // prod mode without build time optimizations (requires a proper TLS termination proxy)
    }
    let env = [
      {name: 'KEYCLOAK_ADMIN', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_user'}}},
      {name: 'KEYCLOAK_ADMIN_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_pass'}}},
      {name: 'KC_DB', value: 'postgres'},
      {name: 'KC_DB_URL', value: 'jdbc:postgresql://postgres-svc:5432/keycloak'},
      {name: 'KC_DB_USERNAME', value: 'keycloak'},
      {name: 'KC_DB_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_kc_pass'}}},
      {name: 'KC_HEALTH_ENABLED', value: 'true'},
      {name: 'KC_HTTP_ENABLED', value: 'true'},
      {name: 'KC_PROXY_HEADERS', value: 'xforwarded'},
      {name: 'KC_HTTP_RELATIVE_PATH', value: this.getPathname(this.cfg.keycloak.publicUrl)}
    ];
    if (!devMode) {
      env.push({name: 'KC_HOSTNAME', value: 'https://' + this.getHostname(this.cfg.keycloak.publicUrl)});
      // env.push({name: 'KC_HOSTNAME_PORT', value: '' + this.getPort(this.cfg.keycloak.publicUrl)}); // FIXME as string!! FIXME does not work at all!!
    }
    let deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {name: 'keycloak', namespace: this.cfg.k8s.namespace, labels: {app: 'keycloak'}},
      spec: {
        replicas: 1,
        selector: {matchLabels: {app: 'keycloak'}},
        template: {
          metadata: {labels: {app: 'keycloak'}},
          spec: {
            initContainers: [{
              name: 'wait-for-postgres',
              image: 'busybox',
              args: [
                '/bin/sh',
                '-c',
                'set -x; while ! nc -zw 10 postgres-svc:5432; do echo "waiting for postgres..."; done'
              ]
            }],
            containers: [{
              name: 'keycloak',
              image: 'ghcr.io/cryptomator/keycloak:26.3.5',
              command: startCmd,
              ports: [{containerPort: 8080}],
              resources: {
                requests: {cpu: '25m', memory: '512Mi'},
                limits: {cpu: '1000m', memory: '1024Mi'},
              },
              livenessProbe: {
                httpGet: {path: `${this.getPathname(HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl))}health/live`, port: 9000},
                initialDelaySeconds: 120,
                periodSeconds: 60
              },
              readinessProbe: {
                httpGet: {path: `${this.getPathname(HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl))}health/ready`, port: 9000},
                initialDelaySeconds: 10,
                periodSeconds: 3
              },
              env: env,
              volumeMounts: [
                {name: 'secrets-vol', mountPath: '/opt/keycloak/data/import/realm.json', subPath: 'realm.json', readOnly: true}
              ]
            }],
            volumes: [
              {
                name: 'secrets-vol',
                secret: {
                  secretName: 'hub-secrets'
                }
              }
            ]
          }
        }
      }
    };
    return jsyaml.dump(deployment, {lineWidth: -1});
  }

  getHubService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'cryptomator-hub-svc'},
      spec: {
        selector: {app: 'cryptomator-hub'},
        ports: [
          {protocol: 'TCP', port: 8080}
        ]
      }
    }
    return jsyaml.dump(service, {lineWidth: -1});
  }

  getPostgresService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'postgres-svc'},
      spec: {
        selector: {app: 'postgres'},
        ports: [
          {protocol: 'TCP', port: 5432}
        ]
      }
    }
    return jsyaml.dump(service, {lineWidth: -1});
  }

  getKeycloakService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'keycloak-svc'},
      spec: {
        selector: {app: 'keycloak'},
        ports: [
          {protocol: 'TCP', port: 8080}
        ]
      }
    }
    return jsyaml.dump(service, {lineWidth: -1});
  }

  getIngress() {
    let hubAndKeycloakSharingHost = this.getHostname(this.cfg.hub.publicUrl) == this.getHostname(this.cfg.keycloak.publicUrl);
    let ingress =  {
      apiVersion: 'networking.k8s.io/v1',
      kind: 'Ingress',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'ingress'},
      spec: {
        rules: [{
          host: this.getHostname(this.cfg.hub.publicUrl),
          http: {
            paths: [{
              path: this.getPathname(this.cfg.hub.publicUrl),
              pathType: 'Prefix',
              backend: {service: {
                name: 'cryptomator-hub-svc',
                port: {number: 8080} 
              }}
            }, ...(!this.cfg.keycloak.useExternal && hubAndKeycloakSharingHost ? [{
              path: this.getPathname(this.cfg.keycloak.publicUrl),
              pathType: 'Prefix',
              backend: {service: {
                name: 'keycloak-svc',
                port: {number: 8080} 
              }}
            }] : [])]
          }
        }, ...(!this.cfg.keycloak.useExternal && !hubAndKeycloakSharingHost ? [{
          host: this.getHostname(this.cfg.keycloak.publicUrl),
          http: {
            paths: [{
              path: this.getPathname(this.cfg.keycloak.publicUrl),
              pathType: 'Prefix',
              backend: {service: {
                name: 'keycloak-svc',
                port: {number: 8080} 
              }}
            }]
          }
        }] : [])
      ]}
    }
    return jsyaml.dump(ingress, {lineWidth: -1});
  }

}

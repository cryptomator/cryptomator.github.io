'use strict';

class HubSetup {

  static LATEST_VERSION = '0.1.0';

  /**
   * The pre-filled config values before being customized by the user
   * @returns default config
   */
  static defaultConfig() {
    return {
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
        publicUrl: '',
        adminUser: 'admin',
        adminPw: 'admin'
      },
      hub: {
        version: this.LATEST_VERSION,
        publicUrl: '',
        adminUser: 'admin',
        adminPw: 'admin',
        syncerUser: 'syncer', // TODO: randomize?
        syncerPw: HubSetup.uuid(),
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
      k8s: HubSetup.writeK8sConfig(cfg),
      compose: HubSetup.writeComposeConfig(cfg),
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

  static getInternalKeycloakUrl(urlStr) {
    try {
      return new URL('kc', HubSetup.urlWithTrailingSlash(urlStr)).href;
    } catch {
      return '<requires-valid-public-hub-url>';
    }
  }

  static containsPathname(urlStr) {
    try {
      let url = new URL(urlStr);
      return url.pathname && url.pathname.length > 1;
    } catch {
      return false;
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
      id: 'cryptomator', // TODO generate UUID?
      realm: 'cryptomator', // TODO make configurable?
      displayName: 'Cryptomator Hub', // TODO make configurable?
      enabled: true,
      sslRequired: 'external',
      defaultRole: {
        name: "user",
        description: "User"
      },
      roles: {
        realm: [
          {
            name: 'admin',
            description: 'Administrator',
            composite: true,
            composites: {
              realm: ['user']
            }
          },
          {
            name: 'syncer',
            description: 'syncer',
            composite: true,
            composites: {
              client: {
                'realm-management': ['view-users']
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
          username: this.cfg.hub.syncerUser,
          enabled: true,
          credentials: [{ type: 'password', value: this.cfg.hub.syncerPw, temporary: false }],
          realmRoles: ['syncer']
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
          'http://127.0.0.1/*',
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
      }],
      browserSecurityHeaders: {
        contentSecurityPolicy: `frame-src 'self'; frame-ancestors 'self' ${this.cfg.hub.publicUrl}; object-src 'none';`
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
      services: {
        'init-config': this.getInitConfigService(),
        'postgres': this.getPostgresService(),
        ...(!this.cfg.keycloak.useExternal) && { 'keycloak': this.getKeycloakService() },
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
      }
    }
  }

  getKeycloakService() {
    let devMode = this.getHostname(this.cfg.keycloak.publicUrl) == 'localhost';
    let startCmd = devMode
      ? 'start-dev --import-realm' // dev mode (no TLS required)
      : 'start --auto-build --import-realm'; // prod mode (requires a proper TLS termination proxy)
    return {
      depends_on: {
        'init-config': {condition: 'service_completed_successfully'},
        'postgres': {condition: 'service_healthy'}
      },
      image: 'quay.io/keycloak/keycloak:18.0.0',
      command: startCmd,
      volumes: ['kc-config:/opt/keycloak/data/import'],
      deploy: {
        resources: {
          limits: {cpus: '2.0', memory: '1024M'}
        }
      },
      ports: [`${this.getPort(this.cfg.keycloak.publicUrl)}:8080`],
      healthcheck: {
        test: ['CMD', 'curl', '-f', `http://localhost:8080${this.getPathname(this.cfg.keycloak.publicUrl)}/health/live`],
        interval: '10s',
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
        KC_HOSTNAME: devMode ? null : this.getHostname(this.cfg.keycloak.publicUrl),
        // KC_HOSTNAME_PORT: devMode ? null : this.getPort(this.cfg.keycloak.publicUrl), // FIXME as string!! FIXME does not work at all!!
        KC_HTTP_ENABLED: 'true',
        KC_PROXY: 'edge',
        KC_HTTP_RELATIVE_PATH: this.getPathname(this.cfg.keycloak.publicUrl),
      }
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
      ports: [`${this.getPort(this.cfg.hub.publicUrl)}:8080`],
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:8080/q/health/live'],
        interval: '10s',
        timeout: '3s',
      },
      restart: 'unless-stopped',
      environment: {
        HUB_KEYCLOAK_PUBLIC_URL: this.cfg.keycloak.publicUrl,
        HUB_KEYCLOAK_LOCAL_URL: !this.cfg.keycloak.useExternal ? `http://keycloak:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl,
        HUB_KEYCLOAK_REALM: 'cryptomator',
        HUB_KEYCLOAK_SYNCER_USERNAME: this.cfg.hub.syncerUser,
        HUB_KEYCLOAK_SYNCER_PASSWORD: this.cfg.hub.syncerPw,
        HUB_KEYCLOAK_SYNCER_CLIENT_ID: 'admin-cli',
        HUB_KEYCLOAK_SYNCER_PERIOD: '5m', // TODO make configurable?
        QUARKUS_OIDC_AUTH_SERVER_URL: new URL('realms/cryptomator', HubSetup.urlWithTrailingSlash(!this.cfg.keycloak.useExternal ? `http://keycloak:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl)).href, // network-internal URL
        QUARKUS_OIDC_TOKEN_ISSUER: new URL('realms/cryptomator', HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)).href,
        QUARKUS_OIDC_CLIENT_ID: 'cryptomatorhub',
        QUARKUS_DATASOURCE_JDBC_URL: 'jdbc:postgresql://postgres:5432/hub',
        QUARKUS_DATASOURCE_USERNAME: 'hub',
        QUARKUS_DATASOURCE_PASSWORD: this.cfg.db.hubPw,
      }
    }
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
        'hub_syncer_user': this.cfg.hub.syncerUser,
        'hub_syncer_pass': this.cfg.hub.syncerPw,
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
                `set -x; while ! wget -q --spider "http://keycloak-svc:8080${this.getPathname(this.cfg.keycloak.publicUrl)}/health/live" 2>>/dev/null; do sleep 10; done`
              ]
            }] : [])],
            containers: [{
              name: 'cryptomator-hub',
              image: `ghcr.io/cryptomator/hub:${this.cfg.hub.version}`,
              imagePullPolicy: 'IfNotPresent', // TODO: remove in production
              ports: [{containerPort: 8080}],
              resources: {
                requests: {cpu: '500m', memory: '256Mi'},
                limits: {cpu: '1000m', memory: '512Mi'},
              },
              startupProbe: {
                httpGet: {path: '/q/health/started', port: 8080},
              },
              livenessProbe: {
                httpGet: {path: '/q/health/live', port: 8080},
              },
              env: [
                {name: 'HUB_KEYCLOAK_PUBLIC_URL', value: this.cfg.keycloak.publicUrl},
                {name: 'HUB_KEYCLOAK_LOCAL_URL', value: !this.cfg.keycloak.useExternal ? `http://keycloak-svc:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl},
                {name: 'HUB_KEYCLOAK_REALM', value: 'cryptomator'},
                {name: 'HUB_KEYCLOAK_SYNCER_USERNAME', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'hub_syncer_user'}}},
                {name: 'HUB_KEYCLOAK_SYNCER_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'hub_syncer_pass'}}},
                {name: 'HUB_KEYCLOAK_SYNCER_CLIENT_ID', value: 'admin-cli'},
                {name: 'HUB_KEYCLOAK_SYNCER_PERIOD', value: '5m'}, // TODO make configurable?
                {name: 'QUARKUS_OIDC_AUTH_SERVER_URL', value: new URL('realms/cryptomator', HubSetup.urlWithTrailingSlash(!this.cfg.keycloak.useExternal ? `http://keycloak-svc:8080${this.getPathname(this.cfg.keycloak.publicUrl)}` : this.cfg.keycloak.publicUrl)).href},
                {name: 'QUARKUS_OIDC_TOKEN_ISSUER', value: new URL('realms/cryptomator', HubSetup.urlWithTrailingSlash(this.cfg.keycloak.publicUrl)).href},
                {name: 'QUARKUS_OIDC_CLIENT_ID', value: 'cryptomatorhub'},
                {name: 'QUARKUS_DATASOURCE_JDBC_URL', value: 'jdbc:postgresql://postgres-svc:5432/hub'},
                {name: 'QUARKUS_DATASOURCE_USERNAME', value: 'hub'},
                {name: 'QUARKUS_DATASOURCE_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_hub_pass'}}},
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
                requests: {cpu: '125m', memory: '32Mi'},
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
    let startCmd = devMode
      ? ['/opt/keycloak/bin/kc.sh', 'start-dev', '--import-realm'] // dev mode (no TLS required)
      : ['/opt/keycloak/bin/kc.sh', 'start', '--auto-build', '--import-realm']; // prod mode (requires a proper TLS termination proxy)
    let env = [
      {name: 'KEYCLOAK_ADMIN', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_user'}}},
      {name: 'KEYCLOAK_ADMIN_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_pass'}}},
      {name: 'KC_DB', value: 'postgres'},
      {name: 'KC_DB_URL', value: 'jdbc:postgresql://postgres-svc:5432/keycloak'},
      {name: 'KC_DB_USERNAME', value: 'keycloak'},
      {name: 'KC_DB_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_kc_pass'}}},
      {name: 'KC_HEALTH_ENABLED', value: 'true'},
      {name: 'KC_HTTP_ENABLED', value: 'true'},
      {name: 'KC_PROXY', value: 'edge'},
      {name: 'KC_HTTP_RELATIVE_PATH', value: this.getPathname(this.cfg.keycloak.publicUrl)}
    ];
    if (!devMode) {
      env.push({name: 'KC_HOSTNAME', value: this.getHostname(this.cfg.keycloak.publicUrl)});
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
              image: 'quay.io/keycloak/keycloak:18.0.0',
              command: startCmd,
              ports: [{containerPort: 8080}],
              resources: {
                requests: {cpu: '1000m', memory: '512Mi'},
                limits: {cpu: '2000m', memory: '1024Mi'},
              },
              livenessProbe: {
                httpGet: {path: `${this.getPathname(this.cfg.keycloak.publicUrl)}/health/live`, port: 8080},
                initialDelaySeconds: 60
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
            }, ...(!this.cfg.keycloak.useExternal ? [{
              path: this.getPathname(this.cfg.keycloak.publicUrl),
              pathType: 'Prefix',
              backend: {service: {
                name: 'keycloak-svc',
                port: {number: 8080} 
              }}
            }] : [])]
          }
        }]
      }
    }
    return jsyaml.dump(ingress, {lineWidth: -1});
  }

}

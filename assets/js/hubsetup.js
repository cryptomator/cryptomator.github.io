'use strict';

class HubSetup {

  /**
   * The pre-filled config values before being customized by the user
   * @returns default config
   */
  static defaultConfig() {
    return {
      k8s: {
        namespace: 'default' // TODO show input field
      },
      db: {
        adminPw: 'postgres', // TODO random UUID?
        keycloakPw: 'keycloak', // TODO show input field
        hubPw: 'hub', // TODO show input field
      },
      keycloak: {
        publicUrl: 'http://localhost:31000',
        adminUser: 'admin', // TODO show input field
        adminPw: 'admin' // TODO show input field
      },
      hub: {
        publicUrl: 'http://localhost:30000',
        adminUser: 'admin',
        adminPw: 'admin',
        syncerUser: 'syncer', // TODO: randomize?
        syncerPw: 'syncer', // TODO: randomize?
      }
    }
  }

  /**
   * Create a Docker Dompose file
   * @param {*} cfg The customized config
   * @returns docker-compose.yaml content
   */
  static writeComposeConfig(cfg) {
    return new DockerComposeConfigBuilder(cfg).build();
  }

  /**
   * Create a Docker Dompose file
   * @param {*} cfg The customized config
   * @returns docker-compose.yaml content
   */
  static writeK8sConfig(cfg) {
    return new KubernetesConfigBuilder(cfg).build();
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
    var url = new URL(urlStr);
    var port = Number.parseInt(url.port);
    var defaultPort = (url.protocol == 'https:') ? 443 : 80;
    return Number.isNaN(port) ? defaultPort : port;
  }

  getHostname(urlStr) {
    var url = new URL(urlStr);
    return url.hostname;
  }

  getRealmConfig() {
    return {
      id: 'cryptomator', // TODO generate UUID?
      realm: 'cryptomator', // TODO make configurable?
      displayName: 'Cryptomator Hub', // TODO make configurable?
      enabled: true,
      sslRequired: 'external',
      roles: {
        realm: [
          {
            name: 'user',
            description: 'User',
            composite: true,
            composites: {
              realm: ['default-roles-cryptomator']
            }
          },
          {
            name: 'admin',
            description: 'Administrator',
            composite: true,
            composites: {
              realm: ['user'],
              client: {
                cryptomatorhub: ['vault-owner']
              }
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
        client: {
          cryptomatorhub: [{ name: 'vault-owner', description: 'Vault Owner' }]
        }
      },
      users: [
        {
          username: this.cfg.hub.adminUser,
          enabled: true,
          attributes: {
            picture: 'https://cryptomator.org/img/logo.svg' // TODO keep this?
          },
          credentials: [{ type: 'password', value: this.cfg.hub.adminPw }],
          realmRoles: ['admin']
        },
        {
          username: this.cfg.hub.syncerUser,
          enabled: true,
          credentials: [{ type: 'password', value: this.cfg.hub.syncerPw }],
          realmRoles: ['syncer']
        }
      ],
      scopeMappings: [
        {
          client: 'cryptomatorhub',
          roles: ['user', 'admin']
        }
      ],
      clientScopeMappings: {
        account: [{
          client: 'cryptomatorhub',
          roles: ['vault-owner']
        }]
      },
      clients: [{
        clientId: 'cryptomatorhub',
        serviceAccountsEnabled: false,
        publicClient: true,
        name: 'Cryptomator Hub',
        enabled: true,
        redirectUris: [
          'http://127.0.0.1/*',
          this.cfg.hub.publicUrl + '/*'
        ],
        webOrigins: ['+'],
        bearerOnly: false,
        frontchannelLogout: false,
        protocol: 'openid-connect',
        attributes: { 'pkce.code.challenge.method': 'S256' }
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
   * Create a Docker Dompose file
   * @returns docker-compose.yaml content
   */
  build() {
    return jsyaml.dump({
      services: {
        'init-config': this.#getInitConfigService(),
        'postgres': this.#getPostgresService(),
        'keycloak': this.#getKeycloakService(),
        'hub': this.#getHubService()
      },
      volumes: {
        'kc-config': {},
        'db-init': {},
        'db-data': {}
      }
    });
  }

  #getInitConfigService() {
    let writeInitDbCmd = `cat >/db-init/initdb.sql << EOF
      CREATE USER keycloak WITH ENCRYPTED PASSWORD '${this.cfg.db.keycloakPw}';
      CREATE DATABASE keycloak WITH ENCODING 'UTF8';
      GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
      CREATE USER hub WITH ENCRYPTED PASSWORD '${this.cfg.db.hubPw}';
      CREATE DATABASE hub WITH ENCODING 'UTF8';
      GRANT ALL PRIVILEGES ON DATABASE hub TO hub;`
      + '\nEOF\n'
    let writeRealmCmd = 'cat >/kc-config/realm.json << EOF\n'
      + JSON.stringify(this.getRealmConfig(), null, 2)
      + '\nEOF\n';
    return {
      image: 'bash:5',
      volumes: ['kc-config:/kc-config', 'db-init:/db-init'],
      command: ['bash', '-c', writeInitDbCmd + writeRealmCmd]
    }
  }

  #getPostgresService() {
    return {
      depends_on: {'init-config': {condition: 'service_completed_successfully'}},
      image: 'postgres:14-alpine',
      volumes: ['db-init:/docker-entrypoint-initdb.d', 'db-data:/var/lib/postgresql/data'],
      deploy: {
        resources: {
          limits: {cpus: '1.0', memory: '150M'}
        }
      },
      ports: ['5432:5432'],
      healthcheck: {
        test: ['CMD', 'pg_isready', '-U', 'postgres'],
        interval: '10s',
        timeout: '3s',
      },
      environment: {
        POSTGRES_PASSWORD: this.cfg.db.adminPw,
        POSTGRES_INITDB_ARGS: '--encoding=UTF8',
      }
    }
  }

  #getKeycloakService() {
    var devMode = this.getHostname(this.cfg.keycloak.publicUrl) == 'localhost';
    var startCmd = devMode
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
          limits: {cpus: '2.0', memory: '768M'}
        }
      },
      ports: [`${this.getPort(this.cfg.keycloak.publicUrl)}:8080`],
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:8080/health/'],
        interval: '10s',
        timeout: '3s',
      },
      environment: {
        KEYCLOAK_ADMIN: this.cfg.keycloak.adminUser,
        KEYCLOAK_ADMIN_PASSWORD: this.cfg.keycloak.adminPw,
        KC_DB: 'postgres',
        KC_DB_URL: 'jdbc:postgresql://postgres:5432/keycloak',
        KC_DB_USERNAME: 'keycloak',
        KC_DB_PASSWORD: this.cfg.db.keycloakPw,
        KC_HEALTH_ENABLED: true,
        KC_HOSTNAME: devMode ? null : this.getHostname(this.cfg.keycloak.publicUrl),
        KC_HOSTNAME_PORT: devMode ? null : this.getPort(this.cfg.keycloak.publicUrl),
        KC_HTTP_ENABLED: true,
        KC_PROXY: 'edge',
      }
    }
  }

  #getHubService() {
    return {
      depends_on: {
        'keycloak': {condition: 'service_healthy'},
        'postgres': {condition: 'service_healthy'}
      },
      image: 'ghcr.io/cryptomator/hub:latest',
      deploy: {
        resources: {
          limits: {cpus: '0.5', memory: '256Mi'}
        }
      },
      ports: [`${this.getPort(this.cfg.hub.publicUrl)}:8080`],
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:8080/'],
        interval: '10s',
        timeout: '3s',
      },
      environment: {
        HUB_KEYCLOAK_PUBLIC_URL: this.cfg.keycloak.publicUrl,
        HUB_KEYCLOAK_LOCAL_URL: 'http://keycloak:8080/',
        HUB_KEYCLOAK_REALM: 'cryptomator',
        HUB_KEYCLOAK_SYNCER_USERNAME: this.cfg.hub.syncerUser,
        HUB_KEYCLOAK_SYNCER_PASSWORD: this.cfg.hub.syncerPw,
        HUB_KEYCLOAK_SYNCER_CLIENT_ID: 'admin-cli',
        HUB_KEYCLOAK_SYNCER_PERIOD: '5m', // TODO make configurable?
        QUARKUS_OIDC_AUTH_SERVER_URL: 'http://keycloak:8080/realms/cryptomator', // network-internal URL
        QUARKUS_OIDC_TOKEN_ISSUER: `${this.cfg.keycloak.publicUrl}/realms/cryptomator`,
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
   * @returns kubernetes deployment yaml content
   */
   build() {
    var result = '';

    // generate namespace:
    if (this.cfg.k8s.namespace != 'default') {
      result += jsyaml.dump({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {name: this.cfg.k8s.namespace }
      });
      result += '\n---\n'
    }

    // Secrets
    result += '# Configuration\n'
    result += this.#getSecrets();
    result += '\n---\n'

    // PVCs
    result += '# PVCs\n'
    result += this.#getPVCs();
    result += '\n---\n'

    // Postgres Deployment
    result += '# Postgres\n'
    result += this.#getPostgresDeployment();
    result += '\n---\n'

    // Keycloak Deployment
    result += '# Keycloak\n'
    result += this.#getKeycloakDeployment();
    result += '\n---\n'

    // Hub Deployment
    result += '# Cryptomator Hub\n'
    result += this.#getHubDeployment();
    result += '\n---\n'

    // Services
    result += '# Services \n'
    result += this.#getHubService();
    result += '\n---\n'
    result += this.#getKeycloakService();
    result += '\n---\n'
    result += this.#getPostgresService();
    result += '\n---\n'

    return result;
  }

  #getSecrets() {
    let realmCfg = this.getRealmConfig();
    let configMap = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'hub-secrets'},
      type: 'Opaque',
      stringData: {
        'kc_admin_user': this.cfg.keycloak.adminUser,
        'kc_admin_pass': this.cfg.keycloak.adminPw,
        'db_admin_pass': this.cfg.db.adminPw,
        'db_hub_pass': this.cfg.db.hubPw,
        'db_kc_pass': this.cfg.db.keycloakPw,
        'hub_syncer_user': this.cfg.hub.syncerUser,
        'hub_syncer_pass': this.cfg.hub.syncerPw,
        'initdb.sql': this.#getInitDbSQL(),
        'realm.json': JSON.stringify(realmCfg, null, 2)
      }
    }
    return jsyaml.dump(configMap);
  }

  #getPVCs() {
    let pvcs = {
      apiVersion: 'v1',
      kind: 'PersistentVolumeClaim',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'dbdata-pvc'},
      spec: {
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {storage: '1Gi'}
        }
      }
    }
    return jsyaml.dump(pvcs);
  }

  #getInitDbSQL() {
    return `
    CREATE USER keycloak WITH ENCRYPTED PASSWORD '${this.cfg.db.keycloakPw}';
    CREATE DATABASE keycloak WITH ENCODING 'UTF8';
    GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
    CREATE USER hub WITH ENCRYPTED PASSWORD '${this.cfg.db.hubPw}';
    CREATE DATABASE hub WITH ENCODING 'UTF8';
    GRANT ALL PRIVILEGES ON DATABASE hub TO hub;`;
  }

  #getHubDeployment() {
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
              name: 'wait-for-keycloak',
              image: 'busybox',
              args: [
                '/bin/sh',
                '-c',
                'set -x; while ! wget -q --spider "http://keycloak-svc:8080/health/live" 2>>/dev/null; do sleep 10; done'
              ]
            }],
            containers: [{
              name: 'cryptomator-hub',
              image: 'ghcr.io/cryptomator/hub:latest',
              imagePullPolicy: 'IfNotPresent', // TODO: remove in production
              ports: [{containerPort: 8080}],
              resources: {
                limits: {cpu: '500m', memory: '256Mi'},
                requests: {cpu: '100m', memory: '64Mi'},
              },
              startupProbe: {
                httpGet: {path: '/q/health/started', port: 8080},
              },
              livenessProbe: {
                httpGet: {path: '/q/health/live', port: 8080},
              },
              env: [
                {name: 'HUB_KEYCLOAK_PUBLIC_URL', value: this.cfg.keycloak.publicUrl},
                {name: 'HUB_KEYCLOAK_LOCAL_URL', value: 'http://keycloak-svc:8080/'},
                {name: 'HUB_KEYCLOAK_REALM', value: 'cryptomator'},
                {name: 'HUB_KEYCLOAK_SYNCER_USERNAME', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'hub_syncer_user'}}},
                {name: 'HUB_KEYCLOAK_SYNCER_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'hub_syncer_pass'}}},
                {name: 'HUB_KEYCLOAK_SYNCER_CLIENT_ID', value: 'admin-cli'},
                {name: 'HUB_KEYCLOAK_SYNCER_PERIOD', value: '5m'}, // TODO make configurable?
                {name: 'QUARKUS_OIDC_AUTH_SERVER_URL', value: 'http://keycloak-svc:8080/realms/cryptomator'},
                {name: 'QUARKUS_OIDC_TOKEN_ISSUER', value: `${this.cfg.keycloak.publicUrl}/realms/cryptomator`},
                {name: 'QUARKUS_OIDC_CLIENT_ID', value: 'cryptomatorhub'},
                {name: 'QUARKUS_DATASOURCE_JDBC_URL', value: 'jdbc:postgresql://postgres-svc:5432/hub'},
                {name: 'QUARKUS_DATASOURCE_USERNAME', value: 'hub'},
                {name: 'QUARKUS_DATASOURCE_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_hub_pass'}}},
              ],
              volumeMounts: [
                {name: 'hub-data', mountPath: '/hub'}
              ]
            }],
            volumes: [
              {name: 'hub-data', emptyDir: {}}
            ]
          }
        }
      }
    };
    return jsyaml.dump(deployment);
  }

  // TODO: change to statefulset
  #getPostgresDeployment() {
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
                requests: {cpu: '100m', memory: '20Mi'},
                limits: {cpu: '1000m', memory: '150Mi'},
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
    return jsyaml.dump(deployment);
  }

  #getKeycloakDeployment() {
    var devMode = this.getHostname(this.cfg.keycloak.publicUrl) == 'localhost';
    var startCmd = devMode
      ? ['/opt/keycloak/bin/kc.sh', 'start-dev', '--import-realm'] // dev mode (no TLS required)
      : ['/opt/keycloak/bin/kc.sh', 'start', '--auto-build', '--import-realm']; // prod mode (requires a proper TLS termination proxy)
    var env = [
      {name: 'KEYCLOAK_ADMIN', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_user'}}},
      {name: 'KEYCLOAK_ADMIN_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_pass'}}},
      {name: 'KC_DB', value: 'postgres'},
      {name: 'KC_DB_URL', value: 'jdbc:postgresql://postgres-svc:5432/keycloak'},
      {name: 'KC_DB_USERNAME', value: 'keycloak'},
      {name: 'KC_DB_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_kc_pass'}}},
      {name: 'KC_HEALTH_ENABLED', value: 'true'},
      {name: 'KC_HTTP_ENABLED', value: 'true'},
      {name: 'KC_PROXY', value: 'edge'}
    ];
    if (!devMode) {
      env.push({name: 'KC_HOSTNAME', value: this.getHostname(this.cfg.keycloak.publicUrl)});
      // env.push({name: 'KC_HOSTNAME_PORT', value: '' + this.getPort(this.cfg.keycloak.publicUrl)}); // FIXME as string!! FIXME does not work at all!!
      // TODO KC_HOSTNAME_PATH ??
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
            // TODO add init container that waits for postgres to be reachable?
            containers: [{
              name: 'keycloak',
              image: 'quay.io/keycloak/keycloak:18.0.0',
              command: startCmd,
              ports: [{containerPort: 8080}],
              resources: {
                requests: {cpu: '100m', memory: '128Mi'},
                limits: {cpu: '2000m', memory: '768Mi'},
              },
              livenessProbe: {
                httpGet: {path: '/health/live', port: 8080},
                initialDelaySeconds: 25
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
    return jsyaml.dump(deployment);
  }

  #getHubService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'cryptomator-hub-svc'},
      spec: {
        selector: {app: 'cryptomator-hub'},
        type: 'NodePort', // TODO: only if requested
        ports: [
          {protocol: 'TCP', port: 8080, nodePort: this.getPort(this.cfg.hub.publicUrl)}
        ]
      }
    }
    return jsyaml.dump(service);
  }

  #getPostgresService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'postgres-svc'},
      spec: {
        selector: {app: 'postgres'},
        ports: [
          {protocol: 'TCP', port: 5432, targetPort: 5432}
        ]
      }
    }
    return jsyaml.dump(service);
  }

  #getKeycloakService() {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: this.cfg.k8s.namespace, name: 'keycloak-svc'},
      spec: {
        selector: {app: 'keycloak'},
        type: 'NodePort', // TODO: only if requested
        ports: [
          {protocol: 'TCP', port: 8080, nodePort: this.getPort(this.cfg.keycloak.publicUrl)}
        ]
      }
    }
    return jsyaml.dump(service);
  }

}
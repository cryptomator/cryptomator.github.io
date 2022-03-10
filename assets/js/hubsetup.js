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
        adminUser: 'admin', // TODO show input field
        adminPw: 'admin' // TODO show input field
      },
      host: {
        url: 'http://localhost:8080',
        adminUser: 'admin',
        adminPw: 'admin'
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
          }
        ],
        client: {
          cryptomatorhub: [{ name: 'vault-owner', description: 'Vault Owner' }]
        }
      },
      users: [
        {
          username: this.cfg.host.adminUser,
          enabled: true,
          attributes: {
            picture: 'https://cryptomator.org/img/logo.svg' // TODO keep this?
          },
          credentials: [{ type: 'password', value: this.cfg.host.adminPw }],
          realmRoles: ['admin']
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
          this.cfg.host.url + '/*'
        ],
        webOrigins: ['+'],
        bearerOnly: false,
        frontchannelLogout: false,
        protocol: 'openid-connect',
        attributes: { 'pkce.code.challenge.method': 'S256' }
      }],
      browserSecurityHeaders: {
        contentSecurityPolicy: `frame-src 'self'; frame-ancestors 'self' http://localhost:*; object-src 'none';`
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
          limits: {cpus: '2.0', memory: '150M'}
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
    return {
      depends_on: {
        'init-config': {condition: 'service_completed_successfully'},
        'postgres': {condition: 'service_healthy'}
      },
      image: 'quay.io/keycloak/keycloak:16.1.1',
      volumes: ['kc-config:/config'],
      deploy: {
        resources: {
          limits: {cpus: '3.0', memory: '600M'}
        }
      },
      ports: ['8180:8080'], // TODO configurable public port
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:8080/auth/realms/master'],
        interval: '10s',
        timeout: '3s',
      },
      environment: {
        KEYCLOAK_IMPORT: '/config/realm.json',
        KEYCLOAK_USER: this.cfg.keycloak.adminUser,
        KEYCLOAK_PASSWORD: this.cfg.keycloak.adminPw,
        DB_VENDOR: 'postgres',
        DB_ADDR: 'postgres',
        DB_PORT: 5432,
        DB_DATABASE: 'keycloak',
        DB_USER: 'keycloak',
        DB_PASSWORD: this.cfg.db.keycloakPw
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
          limits: {cpus: '1.0', memory: '150M'}
        }
      },
      ports: ['8080:8080'], // TODO configurable public port
      healthcheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:8080/'],
        interval: '10s',
        timeout: '3s',
      },
      environment: {
        HUB_KEYCLOAK_PUBLIC_URL: 'http://localhost:8180/auth',
        HUB_KEYCLOAK_REALM: 'cryptomator',
        QUARKUS_OIDC_AUTH_SERVER_URL: 'http://keycloak:8080/auth/realms/cryptomator', // network-internal URL
        QUARKUS_OIDC_TOKEN_ISSUER: 'http://localhost:8180/auth/realms/cryptomator', // public URL
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
            // TODO add init container that waits for keycloak to be reachable?
            containers: [{
              name: 'cryptomator-hub',
              image: 'ghcr.io/cryptomator/hub:latest',
              ports: [{containerPort: 8080}],
              resources: {
                limits: {cpu: '500m', memory: '256Mi'},
                requests: {memory: '64Mi'}
              },
              startupProbe: {
                httpGet: {path: '/q/health/started', port: 8080},
              },
              livenessProbe: {
                httpGet: {path: '/q/health/live', port: 8080},
              },
              env: [
                {name: 'HUB_KEYCLOAK_PUBLIC_URL', value: 'http://localhost:8180/auth'},
                {name: 'HUB_KEYCLOAK_REALM', value: 'cryptomator'},
                {name: 'QUARKUS_OIDC_AUTH_SERVER_URL', value: 'http://keycloak:8080/auth/realms/cryptomator'},
                {name: 'QUARKUS_OIDC_TOKEN_ISSUER', value: 'http://localhost:8180/auth/realms/cryptomator'},
                {name: 'QUARKUS_OIDC_CLIENT_ID', value: 'cryptomatorhub'},
                {name: 'QUARKUS_DATASOURCE_JDBC_URL', value: 'jdbc:postgresql://postgres:5432/hub'},
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
                {name: 'dbdata-vol', mountPath: '/var/lib/postgresql/data'}
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
              image: 'quay.io/keycloak/keycloak:16.1.1', // 17.0.0 doesn't support KEYCLOAK_IMPORT yet...
              ports: [{containerPort: 8080}],
              livenessProbe: {
                httpGet: {path: '/realms/master', port: 8080},
              },
              env: [
                {name: 'KEYCLOAK_IMPORT', value: '/config/realm.json'},
                {name: 'KEYCLOAK_USER', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_user'}}},
                {name: 'KEYCLOAK_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'kc_admin_pass'}}},
                {name: 'DB_VENDOR', value: 'postgres'},
                {name: 'DB_ADDR', value: 'postgres'},
                {name: 'DB_PORT', value: '5432'},
                {name: 'DB_DATABASE', value: 'keycloak'},
                {name: 'DB_USER', value: 'keycloak'},
                {name: 'DB_PASSWORD', valueFrom: {secretKeyRef: {name: 'hub-secrets', key: 'db_kc_pass'}}},
              ],
              volumeMounts: [
                {name: 'secrets-vol', mountPath: '/config/realm.json', subPath: 'realm.json', readOnly: true}
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
        ports: [
          {protocol: 'TCP', port: 8080, targetPort: 8080}
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
        ports: [
          {protocol: 'TCP', port: 8180, targetPort: 8080}
        ]
      }
    }
    return jsyaml.dump(service);
  }

}
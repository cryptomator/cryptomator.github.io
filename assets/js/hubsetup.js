'use strict';

class HubSetup {

  static defaultConfig() {
    return {
      k8s: {
        namespace: 'hub' // TODO show input field and change to "default"
      },
      host: {
        url: 'http://localhost:8080',
        adminUser: 'admin',
        adminPw: 'admin'
      }
    }
  }

  static #getRealmConfig(cfg) {
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
          username: cfg.host.adminUser,
          enabled: true,
          attributes: {
            picture: 'https://cryptomator.org/img/logo.svg' // TODO keep this?
          },
          credentials: [{ type: 'password', value: cfg.host.adminPw }],
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
          cfg.host.url + '/*'
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
  };

  static #getConfigMap(cfg) {
    let realmCfg = this.#getRealmConfig(cfg);
    let configMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {namespace: cfg.k8s.namespace, name: 'hub-config'},
      data: {
        'realm.json': JSON.stringify(realmCfg, null, 2)
      }
    }
    return jsyaml.dump(configMap);
  }

  static #getHubDeployment(cfg) {
    let deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {name: 'cryptomator-hub', namespace: cfg.k8s.namespace, labels: {app: 'cryptomator-hub'}},
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
                {name: 'QUARKUS_OIDC_AUTH_SERVER_URL', value: 'TODO'}
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

  static #getKeycloakDeployment(cfg) {
    let deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {name: 'keycloak', namespace: cfg.k8s.namespace, labels: {app: 'keycloak'}},
      spec: {
        replicas: 1,
        selector: {matchLabels: {app: 'keycloak'}},
        template: {
          metadata: {labels: {app: 'keycloak'}},
          spec: {
            // TODO add init container that waits for keycloak to be reachable?
            containers: [{
              name: 'keycloak',
              image: 'quay.io/keycloak/keycloak:17.0.0',
              args: ['start', '--hostname-strict=false'], // TODO explicitly configure kc hostname
              ports: [{containerPort: 8080}],
              livenessProbe: {
                httpGet: {path: '/realms/master', port: 8080},
              },
              env: [
                {name: 'KEYCLOAK_IMPORT', value: '/config/realm.json'}
              ],
              volumeMounts: [
                {name: 'config', mountPath: '/config', readOnly: true}
              ]
            }],
            volumes: [
              {
                name: 'config',
                configMap: {
                  name: 'hub-config',
                  items: [
                    {key: 'realm.json', path: 'realm.json'}
                  ]
                }
              }
            ]
          }
        }
      }
    };
    return jsyaml.dump(deployment);
  }

  static #getHubService(cfg) {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: cfg.k8s.namespace, name: 'cryptomator-hub-svc'},
      spec: {
        selector: {app: 'cryptomator-hub'},
        ports: [
          {protocol: 'TCP', port: 8080, targetPort: 8080}
        ]
      }
    }
    return jsyaml.dump(service);
  }

  static #getKeycloakService(cfg) {
    let service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {namespace: cfg.k8s.namespace, name: 'keycloak-svc'},
      spec: {
        selector: {app: 'keycloak'},
        ports: [
          {protocol: 'TCP', port: 8180, targetPort: 8080}
        ]
      }
    }
    return jsyaml.dump(service);
  }

  static writeK8sConfig(cfg) {
    var result = '';

    // generate namespace:
    if (cfg.k8s.namespace != 'default') {
      result += jsyaml.dump({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {name: cfg.k8s.namespace }
      });
      result += '\n---\n'
    }

    // ConfigMap
    result += '# Configuration\n'
    result += this.#getConfigMap(cfg);
    result += '\n---\n'

    // Keycloak Deployment
    result += '# Keycloak\n'
    result += this.#getKeycloakDeployment(cfg);
    result += '\n---\n'

    // Hub Deployment
    result += '# Cryptomator Hub\n'
    result += this.#getHubDeployment(cfg);
    result += '\n---\n'

    // Services
    result += '# Services \n'
    result += this.#getHubService(cfg);
    result += '\n---\n'
    result += this.#getKeycloakService(cfg);
    result += '\n---\n'

    return result;
  }

}
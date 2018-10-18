#! /bin/bash

npm install
npm run scaffold

echo <<EOF > src/js/config/Config.dev.ts
// Configuration overrides
const enterprise = true;

export default {
  analyticsKey: "39uhSEOoRHMw6cMR6st9tYXDbAL3JSaP",
  rootUrl: "",
  historyServer: "",
  // Override cluster's uiConfiguration for development
  uiConfigurationFixture: {
    uiConfiguration: {
      plugins: {
        "auth-providers": {
          enabled: enterprise
        },
        authentication: {
          enabled: false
        },
        banner: {
          enabled: false
        },
        branding: {
          enabled: enterprise
        },
        "external-links": {
          enabled: enterprise
        },
        networking: {
          enabled: enterprise,
          dcosLBPackageName: "dcos-lb"
        },
        oauth: {
          enabled: false,
          authHost: "https://dcos.auth0.com"
        },
        organization: {
          enabled: enterprise
        },
        secrets: {
          enabled: enterprise
        },
        intercom: {
          enabled: false,
          appId: "wn4z9z0y"
        },
        tracking: {
          enabled: false
        }
      }
    },
    clusterConfiguration: {
      firstUser: true,
      id: "ui-fixture-cluster-id"
    }
  },
  // Use fixtures to mock API requests
  useFixtures: true,
  // Use uiConfigurationFixture defined above
  useUIConfigFixtures: true
};
EOF

npm start

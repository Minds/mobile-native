const { request } = require('graphql-request');

const query = `
query GetMobileConfig($tenantId: Int!) {
  appReadyMobileConfig(tenantId: $tenantId) {
    APP_NAME
    TENANT_ID
    APP_HOST
    APP_SPLASH_RESIZE
    ACCENT_COLOR_LIGHT
    ACCENT_COLOR_DARK
    WELCOME_LOGO
    THEME
    API_URL
    assets {
      key
      value
    }
    __typename

  }
}
`;

const url =
  'https://c81e728d9d4c2f636f067f89cc14862c.bens-networks.oke.minds.io/api/graphql'; // replace with your GraphQL endpoint

request(url, query, { tenantId: 2 })
  .then(data => console.log(data))
  .catch(err => console.error(err));

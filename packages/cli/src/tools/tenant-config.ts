import { request } from 'graphql-request'
import { generateToken } from './jwt'

export const tenantQuery: string = `
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
    APP_SLUG
    APP_SCHEME
    EAS_PROJECT_ID
    APP_IOS_BUNDLE
    APP_ANDROID_PACKAGE
    APP_TRACKING_MESSAGE_ENABLED
    APP_TRACKING_MESSAGE
    assets {
      key
      value
    }
    __typename
  }
}
`
export async function getTenantConfig(id: string) {
  const graphqlURL: string =
    process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'
  return (
    await request<any>(
      graphqlURL,
      tenantQuery,
      { tenantId: parseInt(id, 10) },
      {
        cookie: 'staging=1;',
        Token: generateToken({ TENANT_ID: id }),
      }
    )
  ).appReadyMobileConfig
}

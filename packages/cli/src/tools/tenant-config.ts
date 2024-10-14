import { request } from 'graphql-request'
import { generateToken } from './jwt'

const tenantMobileQuery: string = `
query GetMobileConfig($tenantId: Int!) {
  appReadyMobileConfig(tenantId: $tenantId) {
    APP_NAME
    TENANT_ID
    APP_HOST
    APP_SPLASH_RESIZE
    ACCENT_COLOR_LIGHT
    PRODUCTION_APP_VERSION
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
    IS_NON_PROFIT
    assets {
      key
      value
    }
    __typename
  }
}
`

// we query the tenant config to get the loggedInLandingPageIdMobile, maybe we should move this to the mobile config query
const tenantQuery: string = `
query GetMultiTenantConfig {
  multiTenantConfig {
    siteName
    siteEmail
    colorScheme
    primaryColor
    canEnableFederation
    federationDisabled
    replyEmail
    boostEnabled
    customHomePageEnabled
    customHomePageDescription
    walledGardenEnabled
    digestEmailEnabled
    welcomeEmailEnabled
    loggedInLandingPageIdMobile
    nsfwEnabled
  }
}
`
function getHeaders(tenantId: string) {
  return {
    cookie: 'staging=1;',
    Token: generateToken({ TENANT_ID: tenantId }),
  }
}

export async function getTenantConfig(id: string) {
  const graphqlURL: string =
    process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'

  const headers = getHeaders(id)

  const mobileConfig = (
    await request<any>(
      graphqlURL,
      tenantMobileQuery,
      { tenantId: parseInt(id, 10) },
      headers
    )
  ).appReadyMobileConfig

  const config = (
    await request<any>(
      mobileConfig.API_URL + 'api/graphql',
      tenantQuery,
      {},
      headers
    )
  ).multiTenantConfig

  mobileConfig.APP_LANDING_PAGE_LOGGED_IN = config.loggedInLandingPageIdMobile

  return mobileConfig
}

export async function setMobileProductionAppVersion(
  tenantId: string,
  productionAppVersion: string
) {
  const graphqlURL: string =
    process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'

  const headers = getHeaders(tenantId)

  const mutation = `
  mutation SetMobileProductionAppVersion {
    mobileProductionAppVersion(tenantId: ${tenantId}, productionAppVersion: "${productionAppVersion}")
  }
  `

  const response = await request(graphqlURL, mutation, {}, headers)
  return response
}

export async function clearAllMobileAppVersions() {
  const graphqlURL: string =
    process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql'

  const headers = getHeaders('1')

  const mutation = `
  mutation  ClearAllMobileAppVersions {
    clearAllMobileAppVersions
  }
  `

  return await request(graphqlURL, mutation, {}, headers)
}

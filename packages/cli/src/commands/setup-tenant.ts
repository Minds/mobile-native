import { GluegunToolbox } from 'gluegun'
import { command, heading, p, warning } from '../tools/pretty'
import { request } from 'graphql-request'
import nodeFetch from 'node-fetch'
import { spinnerAction } from '../tools/spinner'
import { getTenantConfig } from '../tools/tenant-config'

module.exports = {
  name: 'setup-tenant',
  alias: ['s'],
  description:
    'Fetch the tenant configuration and assets for production or a preview',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters } = toolbox

    // the param is returned as a number
    const tenantID = `${parameters.first}`

    if (!tenantID) {
      warning('Please specify the ID of the network: ')
      p()
      command('mobile setup-tenant', '<network-id>', [
        'mobile setup-tenant 1',
        'mobile setup-tenant 1 --preview',
      ])
      return
    }

    if (!toolbox.verifyMobileFolder()) {
      warning('Run this command in the mobile app folder')
      return
    }

    const preview = parameters.options.preview || false

    try {
      await setupTenant(tenantID, preview, toolbox)
    } catch (error) {
      warning(error.message)
      process.exit(1)
    }
    p()
    p(
      `Network${
        parameters.options.preview ? ' preview ' : ' '
      }set up completed!`
    )
    process.exit(0)
  },
}

/**
 * Generate tenant config
 *
 * 0 for minds preview
 * > 0 for tenant id
 */
async function setupTenant(
  id: string,
  preview: boolean,
  toolbox: GluegunToolbox
): Promise<void> {
  heading('Setting up network ' + typeof id)
  const isMinds: boolean = id.trim() === '0'

  const config = await spinnerAction(
    'Fetching tenant configuration',

    async () => {
      const data = isMinds
        ? require('../tenant.json')
        : await getTenantConfig(id)

      if (!isMinds) {
        data.POSTHOG_API_KEY = 'phc_Vm1E7gX6he2WNulsVc4G6sh5IAiYSLku1McMKM0oADP'
      }
      return data
    }
  )
  await spinnerAction('Generating tenant.json', async () => {
    generateTenantJSON(config, preview, toolbox)
  })

  if (!isMinds) {
    // download the assets
    await spinnerAction('Downloading assets', async () => {
      await downloadAssets(config.assets, toolbox)
    })

    const GetNavigationItemsDocument = toolbox.filesystem.read(
      './src/modules/navigation/gql/get-custom-navigation.api.graphql',
      'utf8'
    )

    await spinnerAction('Fetching custom navigation', async () => {
      const md5 = require('md5')
      const customNav = await request<{ customNavigationItems: Array<any> }>(
        `https://${md5(id)}.networks.minds.com/api/graphql`,
        GetNavigationItemsDocument,
        {}
      )

      toolbox.filesystem.write(
        './src/modules/navigation/service/custom-navigation.json',
        customNav.customNavigationItems
      )
    })

    if (preview) {
      await spinnerAction('Copy expo-update override', async () => {
        toolbox.filesystem.copy('./preview/tenant/patches', './patches', {
          overwrite: true,
        })
      })
    } else {
      const { addAdaptiveIcon } = require('../tools/generate-icons')
      await spinnerAction('Generating adaptive icon', async () => {
        // generate the adaptive icon using the provided icon
        await addAdaptiveIcon()
      })
    }

    if (config.APP_TRACKING_MESSAGE_ENABLED) {
      await spinnerAction('Adding tracking-transparency package', async () => {
        await toolbox.packageManager.add('expo-tracking-transparency', {
          force: 'yarn',
        })
      })
    }
  }
}

function generateTenantJSON(
  data: any,
  preview: boolean,
  toolbox: GluegunToolbox
): void {
  if (preview) {
    const previewerTenant = toolbox.filesystem.read(
      './preview/tenant/tenant.json',
      'json'
    )
    data.APP_SLUG = previewerTenant.APP_SLUG
    data.APP_SCHEME = previewerTenant.APP_SCHEME
    data.EAS_PROJECT_ID = previewerTenant.EAS_PROJECT_ID
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE
    data.APP_ANDROID_PACKAGE = previewerTenant.APP_ANDROID_PACKAGE
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE
  }

  const light_background: string = data.BACKGROUND_COLOR_LIGHT || '#FFFFFF'
  const dark_background: string = data.BACKGROUND_COLOR_DARK || '#010101'

  const tenant = {
    APP_NAME: data.APP_NAME || 'Minds Network',
    APP_SCHEME: data.APP_SCHEME,
    APP_SLUG: data.APP_SLUG,
    APP_HOST: data.APP_HOST,
    APP_IOS_BUNDLE: data.APP_IOS_BUNDLE,
    APP_SPLASH_RESIZE: data.APP_SPLASH_RESIZE,
    APP_ANDROID_PACKAGE: data.APP_ANDROID_PACKAGE,
    IS_PREVIEW: preview,
    ACCENT_COLOR_LIGHT: data.ACCENT_COLOR_LIGHT || '#1b85d6',
    ACCENT_COLOR_DARK: data.ACCENT_COLOR_DARK || '#1b85d6',
    BACKGROUND_COLOR_LIGHT: light_background,
    BACKGROUND_COLOR_DARK: dark_background,
    WELCOME_LOGO: data.WELCOME_LOGO,
    ADAPTIVE_ICON: './assets/images/icon_adaptive.png',
    ADAPTIVE_COLOR: data.THEME === 'light' ? light_background : dark_background,
    THEME: data.THEME || 'light', // the backend returns empty when no theme is selected (we default light)
    TENANT_ID: data.TENANT_ID,
    API_URL: data.API_URL,
    APP_TRACKING_MESSAGE_ENABLED: data.APP_TRACKING_MESSAGE_ENABLED,
    APP_TRACKING_MESSAGE: data.APP_TRACKING_MESSAGE,
    EAS_PROJECT_ID: data.EAS_PROJECT_ID,
    POSTHOG_API_KEY: data.POSTHOG_API_KEY,
  }

  toolbox.filesystem.write('tenant.json', JSON.stringify(tenant, null, 2))
}

async function downloadAssets(
  assets: { key: string; value: string }[],
  toolbox: GluegunToolbox
): Promise<void> {
  for (const asset of assets) {
    const response = await nodeFetch(asset.value)
    const filename = assetsMap[asset.key]

    const buffer = await response.buffer()

    toolbox.filesystem.write(`./assets/images/${filename}`, buffer)
  }

  toolbox.filesystem.copy(
    './assets/images/logo_horizontal.png',
    './assets/images/logo_horizontal_dark.png',
    { overwrite: true }
  )
}

const assetsMap: { [key: string]: string } = {
  square_logo: 'logo_square.png',
  splash: 'splash.png',
  horizontal_logo: 'logo_horizontal.png',
  icon: 'icon.png',
  icon_mono: 'icon_mono.png',
  monographic_icon: 'icon_mono.png',
}

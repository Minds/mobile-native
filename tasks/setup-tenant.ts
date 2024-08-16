import { request } from 'graphql-request';
import nodeFetch from 'node-fetch';
import md5 from 'md5';
import fse from 'fs-extra';
import fs from 'fs';
import { generateToken } from '../packages/cli/src/tools/jwt';
import { GetNavigationItemsDocument } from '../src/graphql/api';

const args: string[] = process.argv.slice(2);
const preview: boolean = args[1] === '--preview';
const tenantId: string = args[0];

const query: string = `
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
`;

const url: string =
  process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql';

/**
 * Generate tenant config
 *
 * 0 for minds preview
 * > 0 for tenant id
 */
async function setupTenant(id: string): Promise<void> {
  console.log('Setting up tenant: ', id);
  const isMinds: boolean = id.trim() === '0';
  try {
    const data = isMinds
      ? require('../tenant.json')
      : (
          await request<any>(
            url,
            query,
            { tenantId: parseInt(id, 10) },
            {
              cookie: 'staging=1;',
              Token: generateToken({ TENANT_ID: id }),
            },
          )
        ).appReadyMobileConfig;
    // generate tenant json

    if (!isMinds) {
      data.POSTHOG_API_KEY = 'phc_Vm1E7gX6he2WNulsVc4G6sh5IAiYSLku1McMKM0oADP';
    }

    generateTenantJSON(data);
    if (!isMinds) {
      // download the assets
      await downloadAssets(data.assets);

      const customNav = await request<{ customNavigationItems: Array<any> }>(
        `https://${md5(tenantId)}.networks.minds.com/api/graphql`,
        GetNavigationItemsDocument,
        {},
      );

      fs.writeFileSync(
        './src/modules/navigation/service/custom-navigation.json',
        JSON.stringify(customNav.customNavigationItems, null, 2),
        'utf8',
      );

      console.log('- Custom navigation updated');

      if (!preview) {
        const { addAdaptiveIcon } = require('./adaptive-icon');
        // add adaptive icon & notification icon in the assets folder
        await addAdaptiveIcon();
      }
    }
    if (preview) {
      // copy previewer patches
      copyPatches();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function generateTenantJSON(data: any): void {
  if (preview) {
    const previewerTenant = require('../preview/tenant/tenant.json');
    data.APP_SLUG = previewerTenant.APP_SLUG;
    data.APP_SCHEME = previewerTenant.APP_SCHEME;
    data.EAS_PROJECT_ID = previewerTenant.EAS_PROJECT_ID;
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE;
    data.APP_ANDROID_PACKAGE = previewerTenant.APP_ANDROID_PACKAGE;
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE;
  }

  const light_background: string = data.BACKGROUND_COLOR_LIGHT || '#FFFFFF';
  const dark_background: string = data.BACKGROUND_COLOR_DARK || '#010101';

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
  };

  console.log('- Tenant config:');
  console.log(tenant);
  try {
    fs.writeFileSync('tenant.json', JSON.stringify(tenant, null, 2), 'utf8');
  } catch (error) {
    console.log('Error writing tenant.json');
    console.error(error);
    process.exit(1);
  }
}

async function downloadAssets(
  assets: { key: string; value: string }[],
): Promise<void> {
  for (const asset of assets) {
    const response = await nodeFetch(asset.value);
    const filename = assetsMap[asset.key];
    try {
      const buffer = await response.buffer();

      fs.writeFileSync(`./assets/images/${filename}`, buffer);

      console.log('Downloaded', filename);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  console.log('- Copying logo_square.png to logo_square_dark.png');
  fs.copyFileSync(
    './assets/images/logo_horizontal.png',
    './assets/images/logo_horizontal_dark.png',
  );
}

function copyPatches(): void {
  fse.copy('./preview/tenant/patches', './patches', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('- Preview patches copied successfully');
  });
}

const assetsMap: { [key: string]: string } = {
  square_logo: 'logo_square.png',
  splash: 'splash.png',
  horizontal_logo: 'logo_horizontal.png',
  icon: 'icon.png',
  icon_mono: 'icon_mono.png',
  monographic_icon: 'icon_mono.png',
};

setupTenant(tenantId);

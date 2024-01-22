const { request } = require('graphql-request');
const fetch = require('node-fetch');
const fse = require('fs-extra');
const fs = require('fs');
const { generateToken } = require('./helpers/jwt');

const args = process.argv.slice(2);
const preview = args[1] === '--preview';
const tenantId = args[0];

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

const url = process.env.GRAPHQL_URL || 'https://www.minds.com/api/graphql';

/**
 * Generate tenant config
 */
async function setupTenant(id) {
  try {
    const data = await request(
      url,
      query,
      { tenantId: parseInt(id, 10) },
      {
        Token: generateToken({ TENANT_ID: process.env.TENANT_ID }),
      },
    );
    // generate tenant json
    generateTenantJSON(data.appReadyMobileConfig);
    // download the assets
    await downloadAssets(data.appReadyMobileConfig.assets);
    // copy previewer patches
    copyPatches();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function generateTenantJSON(data) {
  if (preview) {
    const previewerTenant = require('../preview/tenant/tenant.json');
    data.APP_SLUG = previewerTenant.APP_SLUG;
    data.APP_SCHEME = previewerTenant.APP_SCHEME;
    data.EAS_PROJECT_ID = previewerTenant.EAS_PROJECT_ID;
    data.APP_IOS_BUNDLE = previewerTenant.APP_IOS_BUNDLE;
    data.APP_ANDROID_PACKAGE = previewerTenant.APP_ANDROID_PACKAGE;
    data.APP_ANDROID_PACKAGE = previewerTenant.APP_ANDROID_PACKAGE;
  }

  const tenant = {
    APP_NAME: data.APP_NAME,
    APP_SCHEME: data.APP_SCHEME,
    APP_SLUG: data.APP_SLUG,
    APP_HOST: data.APP_HOST,
    APP_IOS_BUNDLE: data.APP_IOS_BUNDLE,
    APP_SPLASH_RESIZE: data.APP_SPLASH_RESIZE,
    APP_ANDROID_PACKAGE: data.APP_ANDROID_PACKAGE,
    IS_PREVIEW: preview,
    ACCENT_COLOR_LIGHT: data.ACCENT_COLOR_LIGHT,
    ACCENT_COLOR_DARK: data.ACCENT_COLOR_DARK,
    WELCOME_LOGO: data.WELCOME_LOGO,
    ADAPTIVE_ICON: '',
    ADAPTIVE_COLOR: '',
    THEME: data.THEME,
    TENANT_ID: data.TENANT_ID,
    API_URL: data.API_URL,
    EAS_PROJECT_ID: data.EAS_PROJECT_ID,
  };

  console.log('Tenant', tenant);
  try {
    fs.writeFileSync('tenant.json', JSON.stringify(tenant, null, 2), 'utf8');
  } catch (error) {
    console.log('Error writing tenant.json');
    console.error(error);
    process.exit(1);
  }
}

async function downloadAssets(assets) {
  for (const asset of assets) {
    const response = await fetch(asset.value);
    const filename = assetsMap[asset.key];
    try {
      const buffer = await response.buffer();

      fs.writeFileSync(`./assets/images/${filename}`, buffer, () =>
        console.log('finished downloading', filename),
      );
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  console.log('Copying logo_square.png to logo_square_dark.png');
  fs.copyFileSync(
    './assets/images/logo_horizontal.png',
    './assets/images/logo_horizontal_dark.png',
  );
}

function copyPatches() {
  fse.copy('./preview/tenant/patches', './patches', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Preview patches copied successfully');
  });
}

const assetsMap = {
  square_logo: 'logo_square.png',
  splash: 'splash.png',
  horizontal_logo: 'logo_horizontal.png',
  icon: 'icon.png',
  icon_mono: 'icon_mono.png',
};

setupTenant(tenantId);

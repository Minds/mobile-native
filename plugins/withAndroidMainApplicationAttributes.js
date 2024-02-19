const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

const { getMainApplicationOrThrow, addMetaDataItemToMainApplication } =
  AndroidConfig.Manifest;

function addProviderToMainApplication(androidManifest) {
  const { manifest } = androidManifest;

  if (!Array.isArray(manifest.application)) {
    console.warn(
      'withWordlLineIntentActivity: No application array in manifest?',
    );
    return androidManifest;
  }

  const application = manifest.application.find(
    item => item.$['android:name'] === '.MainApplication',
  );
  if (!application) {
    console.warn('withWordlLineIntentActivity: No .MainApplication?');
    return androidManifest;
  }

  const meta_data = {};
  meta_data.$ = {
    'android:name': 'android.support.FILE_PROVIDER_PATHS',
    'android:resource': '@xml/filepaths',
    'tools:replace': 'android:resource',
  };

  const provider = {
    'meta-data': meta_data,
  };
  provider.$ = {
    'android:name': 'androidx.core.content.FileProvider',
    'android:authorities': '${applicationId}.provider',
    'android:exported': 'false',
    'android:grantUriPermissions': 'true',
    'tools:replace': 'android:authorities',
  };

  application.provider = provider;

  return androidManifest;
}

module.exports = function withIntentActivity(config) {
  return withAndroidManifest(config, config => {
    config.modResults = addProviderToMainApplication(config.modResults);
    return config;
  });
};

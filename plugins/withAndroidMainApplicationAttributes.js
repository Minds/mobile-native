const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

const { getMainApplicationOrThrow, addMetaDataItemToMainApplication } =
  AndroidConfig.Manifest;

const fs = require('fs');
const path = require('path');

async function saveFileAsync(file_path, content) {
  return fs.promises.writeFile(file_path, content, 'utf8');
}

async function createFilepath(config) {
  const fileDirectory = path.join(
    config.modRequest.platformProjectRoot,
    'app',
    'src',
    'main',
    'res',
    'xml',
  );
  const filepathPath = path.join(fileDirectory, 'filepaths.xml');

  try {
    fs.mkdir(fileDirectory, { recursive: true }, async err => {
      if (err) {
        console.error(err);
        return;
      }
      const content =
        '<?xml version="1.0" encoding="utf-8"?><paths xmlns:android="http://schemas.android.com/apk/res/android"><external-path name="myexternalimages" path="Download/" /><external-path name="external_files" path="."/><cache-path name="cache" path="/" /></paths>';
      saveFileAsync(filepathPath, content);
    });
  } catch (e) {
    console.error('Error saving file', e);
  }
}

function addProviderToMainApplication(androidManifest) {
  const { manifest } = androidManifest;

  if (!Array.isArray(manifest.application)) {
    console.warn('withApplicationProvider: No application array in manifest?');
    return androidManifest;
  }

  const application = manifest.application.find(
    item => item.$['android:name'] === '.MainApplication',
  );
  if (!application) {
    console.warn('withApplicationProvider: No .MainApplication?');
    return androidManifest;
  }

  const meta_data = {};
  meta_data.$ = {
    ...meta_data.$,
    'android:name': 'android.support.FILE_PROVIDER_PATHS',
    'android:resource': '@xml/filepaths',
    'tools:replace': 'android:resource',
  };

  const provider = {
    'meta-data': meta_data,
  };
  provider.$ = {
    ...provider.$,
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
  return withAndroidManifest(config, conf => {
    conf.modResults = addProviderToMainApplication(conf.modResults);
    createFilepath(conf);
    return conf;
  });
};

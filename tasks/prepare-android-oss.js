const fs = require('fs');
const { exec } = require('child_process');
const tenant = require('../tenant.json');
/**
 * Change the version number source to local
 */
function prepareEasJson(buildNumber) {
  const filePath = 'eas.json';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const easJson = JSON.parse(data);
    easJson.cli.appVersionSource = 'local';
    easJson.build.ossProduction.env.MINDS_APP_BUILD = buildNumber;

    fs.writeFile(filePath, JSON.stringify(easJson, null, 2), 'utf8', err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('package.json updated successfully');
    });
  });
}

// Validate
if (tenant.EAS_PROJECT_ID !== '7a92bc49-6d7e-468f-af13-0a9aff39fc0e') {
  console.error(
    'EAS_PROJECT_ID is not incorrect, OSS build should be used only for Minds app',
  );
  return;
}

console.log('Getting the latest build number from EAS...');
exec(
  'npx eas-cli build:version:get --json --non-interactive --platform android',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(stdout);
      console.log('Latest build number:', jsonResponse.versionCode);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return;
    }
    const buildNumber = parseInt(jsonResponse.versionCode, 10) + 1050000001;
    console.log('Latest build number:', buildNumber);
    // prepare eas.json
    prepareEasJson(buildNumber.toString());
  },
);

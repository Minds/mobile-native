const fs = require('fs');
const fse = require('fs-extra');
/**
 * Adds the preview index as the entry point of the app
 */
function preparePackageJson() {
  const filePath = 'package.json';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const packageJson = JSON.parse(data);
    packageJson.main = 'preview/index.js';

    fs.writeFile(
      filePath,
      JSON.stringify(packageJson, null, 2),
      'utf8',
      err => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('package.json updated successfully');
      },
    );
  });
}

/**
 * Copy preview/tenant content into the root of the project
 */
function copyTenantContent() {
  const sourceDir = './preview/tenant';
  const destinationDir = './';

  fse.copy(sourceDir, destinationDir, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Tenant content copied successfully');
  });
}

preparePackageJson();
copyTenantContent();

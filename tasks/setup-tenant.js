const fs = require('fs');
const fse = require('fs-extra');
const args = process.argv.slice(2);

const tenant = args[0];
const preview = args[1] === '--preview';

if (tenant) {
  console.log(`Setting up tenant ${tenant}`);
  prepareTenant(tenant);
  // Implement tenant setup here
} else {
  console.log('No tenant provided, default to minds');
}

function prepareTenant(companyID) {
  const command =
    'npx eas-cli build --platform android --profile demo --non-interactive --json --no-wait';
  // const command = `eas build --platform android --profile demo --non-interactive --json --no-wait --local`;
  // const Tenant = require(`../tenants/${companyID}/tenant.json`);
  fs.copyFileSync(`../tenants/${companyID}/tenant.json`, './tenant.json');

  if (fs.existsSync(`../tenants/${companyID}/icon.png`)) {
    fs.copyFileSync(
      `../tenants/${companyID}/icon.png`,
      './assets/images/icon.png',
    );
  } else {
    fs.copyFileSync(
      `../tenants/${companyID}/square.png`,
      './assets/images/icon.png',
    );
  }

  fs.copyFileSync(
    `../tenants/${companyID}/square.png`,
    './assets/images/logo_square.png',
  );

  fs.copyFileSync(
    `../tenants/${companyID}/horizontal.png`,
    './assets/images/logo_horizontal.png',
  );
  fs.copyFileSync(
    `../tenants/${companyID}/horizontal.png`,
    './assets/images/logo_horizontal_dark.png',
  );

  fs.copyFileSync(
    `../tenants/${companyID}/splash.png`,
    './assets/images/splash.png',
  );

  if (fs.existsSync(`../tenants/${companyID}/adaptive-icon.png`)) {
    fs.copyFileSync(
      `../tenants/${companyID}/adaptive-icon.png`,
      './assets/images/adaptive-icon.png',
    );
  }

  if (preview) {
    console.log('Preview mode, overriding tenant.json properties...');
    fs.readFile('./preview/tenant/tenant.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const previewJson = JSON.parse(data);

      fs.readFile('./tenant.json', 'utf8', (errTenant, dataTenant) => {
        if (errTenant) {
          console.error(errTenant);
          return;
        }

        const tenantJson = JSON.parse(data);

        tenantJson.EAS_PROJECT_ID = previewJson.EAS_PROJECT_ID;
        tenantJson.APP_SLUG = previewJson.APP_SLUG;
        tenantJson.IS_PREVIEW = true;

        fs.writeFile(
          './tenant.json',
          JSON.stringify(tenantJson, null, 2),
          'utf8',
          err => {
            if (err) {
              console.error(err);
              return;
            }
            console.log('tenant.json updated successfully');
          },
        );
      });
    });

    fse.copy('./preview/tenant/patches', './patches', err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Preview patches copied successfully');
    });
  }

  // const childProcess = exec(command, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error building for ${company.name}: ${error}`);
  //   } else {
  //     console.log(`Build for ${company.name} completed successfully.`);
  //     console.log(stdout);
  //   }
  // });

  // childProcess.stdout.on('data', data => {
  //   console.log(data);
  // });

  // childProcess.stderr.on('data', data => {
  //   console.error(data);
  // });
}

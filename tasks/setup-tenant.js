const { exec } = require('child_process');
const fs = require('fs');

const args = process.argv.slice(2);

const tenant = args[0];

if (tenant) {
  console.log(`Setting up tenant ${tenant}`);
  prepareTenant(tenant);
  // Implement tenant setup here
} else {
  console.log('No tenant provided, default to minds');
}

// const tenants = [
//   {
//     id: 1,
//     name: 'Bitchute',
//     color: '#EE4035',
//     theme: 'light',
//   },
//   {
//     id: 2,
//     name: 'Fishtank',
//     color: '#F30F01',
//     theme: 'dark',
//   },
//   {
//     id: 3,
//     name: 'Law Enforcement Today',
//     color: '#2B385A',
//     theme: 'light',
//   },
//   {
//     id: 4,
//     name: 'Livepeer',
//     color: '#1FC47E',
//     theme: 'dark',
//   },
//   {
//     id: 5,
//     name: 'MacIver Institute',
//     color: '#123459',
//     theme: 'light',
//   },
//   {
//     id: 6,
//     name: 'PublicSq.',
//     color: '#642EFF',
//     theme: 'light',
//   },
//   {
//     id: 7,
//     name: 'Rebel News',
//     color: '#098FD3',
//     theme: 'light',
//   },
//   {
//     id: 8,
//     name: 'SCNR',
//     color: '#FFFFFF',
//     theme: 'dark',
//   },
//   {
//     id: 9,
//     name: 'The Grayzone',
//     color: '#000000',
//     theme: 'light',
//   },
//   {
//     id: 10,
//     name: 'The Joe Rogan Experience',
//     color: '#FFFFFF',
//     theme: 'dark',
//   },
//   {
//     id: 11,
//     name: 'The Post Millennial',
//     color: '#A00000',
//     theme: 'light',
//   },
//   {
//     id: 12,
//     name: 'Valuetainment',
//     color: '#EA2126',
//     theme: 'dark',
//   },
//   {
//     id: 13,
//     name: 'ZUBY',
//     color: '#5D00AA',
//     theme: 'dark',
//   },
//   // Add more companies here
// ];

function prepareTenant(companyID) {
  const command =
    'npx eas-cli build --platform android --profile demo --non-interactive --json --no-wait';
  // const command = `eas build --platform android --profile demo --non-interactive --json --no-wait --local`;
  // const Tenant = require(`../tenants/${companyID}/tenant.json`);
  console.log(`Preparing tenant ${companyID}...`);

  fs.copyFileSync(`./tenants/${companyID}/tenant.json`, './tenant.json');

  if (fs.existsSync(`./tenants/${companyID}/icon.png`)) {
    fs.copyFileSync(
      `./tenants/${companyID}/icon.png`,
      './assets/images/icon.png',
    );
  } else {
    fs.copyFileSync(
      `./tenants/${companyID}/square.png`,
      './assets/images/icon.png',
    );
  }

  fs.copyFileSync(
    `./tenants/${companyID}/square.png`,
    './assets/images/logo_square.png',
  );

  fs.copyFileSync(
    `./tenants/${companyID}/horizontal.png`,
    './assets/images/logo_horizontal.png',
  );
  fs.copyFileSync(
    `./tenants/${companyID}/horizontal.png`,
    './assets/images/logo_horizontal_dark.png',
  );

  fs.copyFileSync(
    `./tenants/${companyID}/splash.png`,
    './assets/images/splash.png',
  );

  if (fs.existsSync(`./tenants/${companyID}/adaptive-icon.png`)) {
    fs.copyFileSync(
      `./tenants/${companyID}/adaptive-icon.png`,
      './assets/images/adaptive-icon.png',
    );
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

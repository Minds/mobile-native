import { config } from '../wdio.shared.conf';

// =============================
// Browserstack specific config
// =============================
// User configuration
config.user = process.env.BROWSERSTACK_USERNAME || '';
config.key = process.env.BROWSERSTACK_ACCESS_KEY || '';

// Use browserstack service
config.services = [
  [
    'browserstack',
    {
      testObservability: true,
      testObservabilityOptions: {
        projectName: 'Minds',
        buildName: 'Build name', // if useful, please get this from the pipeline or somewhere
      },
      browserstackLocal: false,
    },
  ],
];

export const localIdentifier = `e2e:id:${Date.now()}`;

// // Code to start browserstack local before start of test
// config.onPrepare = function onPrepare(config, capabilities) {
//   console.log('Connecting local...');
//   return new Promise<void>((resolve, reject) => {
//     exports.bs_local = new browserstack.Local();
//     exports.bs_local.start(
//       { localIdentifier, key: config.key },
//       (error: any) => {
//         if (error) {
//           return reject(error);
//         }
//         console.log('Connected. Now testing...');

//         resolve();
//       }
//     );
//   });
// };

// // Code to stop browserstack local after end of test
// config.onComplete = function onComplete(capabilties, specs) {
//   console.log('Closing local tunnel...');
//   return new Promise<void>((resolve, reject) => {
//     exports.bs_local.stop((error: any) => {
//       if (error) {
//         return reject(error);
//       }
//       console.log('Stopped BrowserStackLocal...');

//       resolve();
//     });
//   });
// };

export default config;

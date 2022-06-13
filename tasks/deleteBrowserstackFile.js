const fetch = require('node-fetch');
const Buffer = require('buffer').Buffer;
const args = process.argv.slice(2);

/**
 * This script will delete the app from Browserstack if it exists.
 */
const task = async () => {
  const response = await fetch(
    'https://api-cloud.browserstack.com/app-live/recent_apps?limit=200',
    {
      method: 'GET',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(process.env.CI_BROWSERSTACK_APIKEY).toString('base64'),
      },
    },
  );

  const json = await response.json();

  const filename = args[0];

  if (Array.isArray(json)) {
    const idsArray = json.filter(app => app.app_name === filename);
    for (let i = 0; i < idsArray.length; i++) {
      const app = idsArray[i];
      if (app) {
        console.log('App found:', app.app_id);
        console.log('Deleting app...');
        const delResponse = await fetch(
          'https://api-cloud.browserstack.com/app-live/app/delete/' +
            app.app_id,
          {
            method: 'DELETE',
            headers: {
              Authorization:
                'Basic ' +
                Buffer.from(process.env.CI_BROWSERSTACK_APIKEY).toString(
                  'base64',
                ),
            },
          },
        );
        const result = await delResponse.json();
        if (result.success) {
          console.log('App deleted');
        } else {
          console.error('App delete failed');
          process.exit(1);
        }
      } else {
        console.log('App not found');
      }
    }
  } else {
    console.log('Invalid response from Browserstack API');
  }
};

if (args.length === 1) {
  task(args[0]);
} else {
  console.log('Usage: node deleteBrowserstackFile.js FileName');
}

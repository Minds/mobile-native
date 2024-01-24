const fetch = require('node-fetch');
const { generateToken } = require('./helpers/jwt');

const webhookUrl = process.env.WEBHOOK_URL;
const args = process.argv.slice(2);
const status = args[0] === 'failed' ? 'failed' : 'success';

/**
 * Call the build webhook (3 attempts)
 */
async function callBuildWebhook() {
  let attempts = 3;
  for (let i = 0; i < attempts; i++) {
    try {
      console.log('Calling webhook: ' + status);
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Token: generateToken({ TENANT_ID: process.env.TENANT_ID }),
        },
        body: JSON.stringify({
          TENANT_ID: process.env.TENANT_ID,
          TOKEN: process.env.TOKEN,
          status,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to call webhook');
      }
      if (status === 'failed') {
        // If failed, exit the process to stop the pipeline
        console.log('Webhook called successfully');
        process.exit(1);
      }
      break; // If successful, break the loop
    } catch (error) {
      console.error(error);
      if (i === attempts - 1) {
        // If this was the last attempt, exit the process
        process.exit(1);
      }
    }
  }
}

callBuildWebhook();
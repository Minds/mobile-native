import { createReadStream, writeFileSync } from 'fs';
import { join } from 'path';
const request = require('request');

const options = {
  method: 'GET',
  uri: 'https://www.minds.com/api/v1/minds/config'
};

/**
 * Update the default values with the latests production values
 */
request(options, (error, response, body) => {
  if (error) {
    reject(error);
    return;
  }
  if (response && response.statusCode) {

    const destination = join(__dirname, '..', 'settings', `default.json`);

    writeFileSync(destination, body);

    return;
  }
  reject('Call to minds endpoint failed');
});
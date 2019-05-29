import { argv } from 'yargs';
import { join } from 'path';
import { createReadStream, writeFileSync } from 'fs';
const https = require('https');
const request = require('request');
const querystring = require('querystring');
const url = require('url');

const PROJECT_ID = '196553';

/**
 * Http request
 * @param {string} uri
 * @param {string} method
 * @param {object} data
 * @param {object} extraOptions
 */
function req(uri, method = 'get', data = null, extraOptions = {}) {
  return new Promise((resolve, reject) => {
    const isPost = method.toUpperCase() === 'POST';

    const options = {
      method: method.toUpperCase(),
      headers: {},
      ...url.parse(uri),
      ...extraOptions,
    };

    let body = '';

    if (data) {
      body = querystring.stringify(data);
    }

    if (isPost && data && !options.headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = body.length;
    }

    const req = https.request(options, res => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${statusCode}`));
      }

      res.setEncoding('utf8');

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(body);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', e => {
      reject(e);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

/**
 * Upload a locale to poeditor
 * @param {string} locale
 */
const uploadLocale = (locale, overwrite = 0) => {

  overwrite = overwrite ? 1 : 0;

  const source = join(__dirname, '..', 'locales', `${locale}.json`);

  const options = {
    method: 'POST',
    uri: 'https://api.poeditor.com/v2/projects/upload',
    formData: {
      file: createReadStream(source),
      api_token: argv['poeditor-key'],
      id: argv['poeditor-id'] || PROJECT_ID,
      sync_terms:1,
      updating: 'terms_translations',
      language:locale,
      overwrite
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      if (response && response.statusCode) {
        const json = JSON.parse(body);
        if (json.response.status !== 'success') {
          reject(new Error(json.response.message || JSON.stringify(json.response)));
          return;
        }
        resolve(json.result);
        return;
      }
      reject('Unknown error');
    });
  });
}

/**
 * Download a locale to locales/ folder
 * @param {string} locale
 */
const downloadLocale = async (locale, force=false) => {

  if (!locale) {
    console.log('Please specify a locale');
    return;
  }

  if (locale === 'en' && !force) throw new Error('You can\'t export the english locale');

  const { response, result } = JSON.parse(await req('https://api.poeditor.com/v2/projects/export', 'post', {
    api_token: argv['poeditor-key'],
    id: argv['poeditor-id'] || PROJECT_ID,
    language: locale,
    filters:'translated',
    type: 'key_value_json',
  }));

  if (response.status !== 'success' || !result.url) {
    throw new Error(response.message || JSON.stringify(response));
  }

  console.log(`* Downloading ${result.url}…`);

  const fileContent = await req(result.url);

  if (!fileContent) {
    throw new Error('Invalid file');
  }

  const destination = join(__dirname, '..', 'locales', `${locale}.json`);

  writeFileSync(destination, fileContent);

  console.log(`* Saved to ${destination}…`);
}

/**
 * List all poeditor locales
 */
const listLocales = async () => {
  const { response, result } = JSON.parse(await req('https://api.poeditor.com/v2/languages/list', 'post', {
    api_token: argv['poeditor-key'],
    id: argv['poeditor-id'] || PROJECT_ID,
  }));

  if (response.status !== 'success' ) {
    throw new Error(response.message || JSON.stringify(response));
  }

  return result.languages;
}

/**
 * Download all locales (except 'en')
 */
const downloadAllLocales = async () => {
  const locales = await listLocales();

  locales.forEach(async locale => {
    if (locale.code !== 'en') {
      console.log(`Downloading ${locale.code} ${locale.name}...`);
      await downloadLocale(locale.code);
    }
  });
}

// MAIN
const run = async() => {
  try {
    console.log(argv['overwrite'])
    if (!argv['poeditor-key']) {
      throw new Error('Please specify a poeditor.com API key (--poeditor-key)');
    }

    if (!(argv['poeditor-id'] || PROJECT_ID)) {
      throw new Error('Please specify a poeditor.com Project ID (--poeditor-id');
    }

    if (!argv._[0]) {
      throw new Error('missing command parameter: yarn locale [command]')
    }

    switch(argv._[0]) {
      case 'list':
        const locales = await listLocales();
        console.log(locales);
        break;
      case 'download':
        if (!argv._[1]) {
          throw new Error('missing locale parameter: yarn locale download [locale]\nExample yarn locale download es')
        }
        downloadLocale(argv._[1], true);
        break;
      case 'downloadAll':
        downloadAllLocales();
        break;
      case 'upload': {
        const response = await uploadLocale('en', argv['overwrite']);
        console.log('Terms:',response.terms);
        console.log('Translations:',response.translations);
      }
    }
  } catch(e) {
    console.log(e.message || 'Ooops');
  }
}

run();
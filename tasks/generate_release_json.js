const filepath = process.argv[2];
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const releases = require('../releases.json');
const hash256 = crypto.createHash('sha256');
const hash512 = crypto.createHash('sha512');
const hashmd5 = crypto.createHash('md5');
const input = fs.createReadStream(filepath);

// read version
const gradleProperties = fs.readFileSync('./android/gradle.properties');

let version = gradleProperties.toString().match(/versionName=(.*)/);
if (version) {
  version = version[1];
  releases.versions.forEach(v => {
    if (v.version === version) {
      console.log('The version already exist to the json file');
      process.exit(1);
    }
  });
} else {
  console.log('Error reading the version');
  process.exit(1);
}

const filename = path.basename(filepath);

input.on('readable', () => {
  const data = input.read();
  if (data) {
    hash256.update(data);
    hash512.update(data);
    hashmd5.update(data);
  } else {
    const v = {
      version: version,
      timestamp: (new Date()).timestamp,
      href: 'https://cdn-assets.minds.com/android/' + filename,
      sourceHref: 'https://gitlab.com/minds/mobile-native/commits/v' + version,
      changelog: ['Changelog here'],
      unstable: false,
      hashes: [
        {
          type: 'md5',
          value: hashmd5.digest('hex'),
        },
        {
          type: 'sha256',
          value: hash256.digest('hex'),
        },
        {
          type: 'sha512',
          value: hash512.digest('hex'),
        },
      ],
    };
    releases.versions.unshift(v);

    fs.writeFileSync('./releases.json', JSON.stringify(releases, null, 2));
  }
});

/**
 * Simple utility task to search unused terms in the en.json language file
 */
const { exec } = require('child_process');
const locale = require('../locales/en.json');

// final result
let result = true;

// ignore some dynamic generated terms
const ignore = [
  'permissions.notAllowed.',
  'reports.reasons.',
  'notificationSettings.',
  'boosts.rejectionReasons.',
  'subtype.',
  'validation.',
  'date.formats.',
  'settings.reportedContent.action.',
  'channel.mutualSubscribers.',
  'discovery.filters.',
  'auth.createNewPassword',
  'auth.resetPassword',
  'supermind.filter.',
  'supermind.replyType.',
  'notification.verbs.',
  'notification.empty.',
  'interactions.',
  'settings.',
  'analytics.tokens.labels.',
  'analytics.tokens.tooltips.',
  'earnScreen.',
  'join',
  'leave',
  'awaiting',
  'group.buttonInvited',
  'monetize.',
  'nsfw.',
  'wallet.tokens.',
  'wallet.transactions.',
];

/**
 * Search the term in the project's js files
 * @param {string} term
 */
async function search(term) {
  return new Promise(resolve => {
    // ignore dynamic generated terms
    if (ignore.some(t => (t.endsWith('.') ? term.startsWith(t) : term === t))) {
      resolve(true);
      return;
    }

    exec(
      `grep -rnw -m1 ./src ./*.js -e "\\(t\\|to\\|l\\)('${term}'"`,
      (err, stdout) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      },
    );
  });
}

/**
 * Traverse the json object
 * @param {json} jsonObj
 * @param {key} k
 */
async function traverse(jsonObj, k = '') {
  if (jsonObj !== null && typeof jsonObj === 'object') {
    const props = Object.entries(jsonObj);
    const promises = [];
    for (let [key, value] of props) {
      promises.push(traverse(value, k ? `${k}.${key}` : key));
    }
    await Promise.all(promises);
  } else {
    if (!(await search(k))) {
      result = false;
      console.log(`${k} not found in project.`);
    }
  }
}

/**
 * Run the search
 */
traverse(locale).then(() => {
  if (!result) {
    process.exit(1);
  } else {
    console.log('No unused terms found!');
  }
});

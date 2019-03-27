const request = require('request')

const factory = function(data) {
  return {
    specDone: async (result) => {
      if (result.status === 'failed') {
        const reason = 'Suite: ' + result.description + ' was ' + result.status;

        const url = `https://api-cloud.browserstack.com/app-automate/sessions/${data.sessiondID}.json`;

        const options = {
          json: true,
          body: {status: 'failed', reason},
          auth: {
            'user': process.env.bsUSER,
            'pass': process.env.bsKEY,
            'sendImmediately': true
          }
        };

        return await new Promise((resolve, reject) => {
          try {
            request.put(url, options, (err, res, body) => {
              if (err) {
                console.log('Error informing failed session to browserstack');
                reject(err);
              } else {
                console.log('INFORMED');
                resolve(body);
              }
            });
          } catch (err) {
            console.log('Error informing failed session to browserstack');
            reject(err);
          }
        });
      }
    }
  };
}

export default factory;
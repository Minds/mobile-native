const axios = require('axios');

// Read data from stdin
let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  try {
    // Parse JSON data
    const jsonData = JSON.parse(inputData);

    const ios = jsonData.find(entry => entry.platform === 'ios');
    const android = jsonData.find(entry => entry.platform === 'android');

    if (!ios || !android) {
      console.error('Could not find ios or android entry in JSON data');
      process.exit(1);
    }

    try {
      // Make the request
      await createComment(
        `https://qr.expo.dev/eas-update?updateId=${ios.id}&appScheme=minds&host=u.expo.dev`,
        `https://qr.expo.dev/eas-update?updateId=${android.id}&appScheme=minds&host=u.expo.dev`,
      );
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(`Error parsing JSON data: ${error.message}`);
  }
});

/**
 * Create a gitlab comment with the QR codes to test
 * @param {*} linkIOS
 * @param {*} linkAndroid
 */
async function createComment(linkIOS, linkAndroid) {
  // Read environment variables
  const projectId = process.env.CI_MERGE_REQUEST_PROJECT_ID;
  const mergeRequestIid = process.env.CI_MERGE_REQUEST_IID;
  const privateToken = process.env.PROJECT_BOT;

  // Ensure that all required environment variables are set
  if (
    !projectId ||
    !mergeRequestIid ||
    !privateToken ||
    !linkIOS ||
    !linkAndroid
  ) {
    console.error(
      'Missing required variables. Please set CI_MERGE_REQUEST_PROJECT_ID, CI_MERGE_REQUEST_IID, PROJECT_BOT, linkAndroid, and linkIOS.',
    );
    process.exit(1);
  }

  // Construct the request data
  const postData = {
    body: `Android Preview\n![url](${linkAndroid})\n\n\niOS Preview\n![url](${linkIOS})`,
  };

  // Construct the Axios request config
  const axiosConfig = {
    method: 'post',
    url: `https://gitlab.com/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`,
    headers: {
      'PRIVATE-TOKEN': privateToken,
      'Content-Type': 'application/json',
    },
    data: postData,
  };

  // Make the Axios request
  return axios(axiosConfig);
}

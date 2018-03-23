import {
  Alert,
} from 'react-native';

import {
  setNativeExceptionHandler,
  setJSExceptionHandler
} from 'react-native-exception-handler';

if (!__DEV__) {
  /**
   * Globar error handlers
   */
  const jsErrorHandler = (e, isFatal) => {
    if (isFatal) {
      /*Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
      `,
        [{
          text: 'Ok',
        }]
      );*/

      console.log(e, 'Minds Uncaught (fatal)');
    } else if (e) {
      console.log(e, 'Minds Uncaught (non-fatal)'); // So that we can see it in the ADB logs in case of Android if needed
    }
  };

  /**
   * Js Errors
   */
  setJSExceptionHandler(jsErrorHandler, true);

  /**
   * Native Errors
   */
  setNativeExceptionHandler((exceptionString) => {
    console.log(exceptionString);
  });
}

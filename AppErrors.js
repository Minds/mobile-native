import {
  Alert,
} from 'react-native';

import {
  setNativeExceptionHandler,
  setJSExceptionHandler
} from 'react-native-exception-handler';

import { onError } from "mobx-react";
import logService from './src/common/services/log.service';

onError(error => {
  console.log(error);
  logService.exception(error);
})

if (!__DEV__) {
  /**
   * Globar error handlers
   */
  const jsErrorHandler = (e, isFatal) => {
    if (isFatal) {
      if (e) {
        Alert.alert(
          'Unexpected error occurred',
          `
          Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        `,
          [{
            text: 'Ok',
          }]
        );
      }

      console.log('Minds Uncaught (fatal)', e);
    } else if (e) {
      console.log('Minds Uncaught (non-fatal)', e); // So that we can see it in the ADB logs in case of Android if need, eed
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
    logService.exception(exceptionString);
  });
}

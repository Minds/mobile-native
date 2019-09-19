import {
  Alert,
} from 'react-native';

import {
  setNativeExceptionHandler,
  setJSExceptionHandler
} from 'react-native-exception-handler';

import { onError } from "mobx-react";
import logService from './src/common/services/log.service';
import * as Sentry from '@sentry/react-native';
import { isAbort } from './src/common/helpers/abortableFetch';
import { isApiError } from './src/common/services/api.service';


// Init Sentry

Sentry.init({
  dsn: 'https://d650fc58f2da4dc8ae9d95847bce152d@sentry.io/1538735',
  ignoreErrors: [
    'Non-Error exception captured with keys: code, domain, localizedDescription', // ignore initial error of sdk
  ],
  beforeSend(event, hint) {
    // for dev only log into the console
    if (__DEV__) {
      console.log('sentry', event, hint);
      return null;
    }

    // ignore aborts
    if (hint.originalException && isAbort(hint.originalException)) {
      return null;
    }

    // only log api 500 errors
    if (hint.originalException && isApiError(hint.originalException) && hint.originalException.status < 500) {
      return null;
    }

    return event;
  }
});

// Log Mobx global errors
onError(error => {
  console.log(error);
  logService.exception(error);
})

// react-native-exception-handler global handlers
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
    Sentry.captureException(new Error(exceptionString), {
      logger: 'NativeExceptionHandler',
    });
    console.log(exceptionString);
  });
}

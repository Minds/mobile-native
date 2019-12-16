import {Alert} from 'react-native';

import {setNativeExceptionHandler} from 'react-native-exception-handler';

import {onError} from 'mobx-react';
import logService from './src/common/services/log.service';
import * as Sentry from '@sentry/react-native';
import shouldReportToSentry from './src/common/helpers/errors';

// Init Sentry (if not running test)
if (process.env.JEST_WORKER_ID === undefined) {
  Sentry.init({
    dsn: 'https://16c9b543563140a0936cc3cd3714481d@sentry.io/1766867',
    ignoreErrors: [
      'Non-Error exception captured with keys: code, domain, localizedDescription', // ignore initial error of sdk
    ],
    beforeSend(event, hint) {
      if (hint.originalException) {
        if (!shouldReportToSentry(hint.originalException)) {
          return null;
        }
      }

      // for dev only log into the console
      if (__DEV__) {
        console.log('sentry', event, hint);
        return null;
      }

      return event;
    },
  });
}

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

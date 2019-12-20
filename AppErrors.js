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
import { isAbort, isNetworkFail } from './src/common/helpers/abortableFetch';
import { isApiError } from './src/common/services/api.service';
import { isUserError } from './src/common/UserError';


// Init Sentry (if not running test)
if (process.env.JEST_WORKER_ID === undefined) {
  Sentry.init({
    dsn: 'https://16c9b543563140a0936cc3cd3714481d@sentry.io/1766867',
    ignoreErrors: [
      'Non-Error exception captured with keys: code, domain, localizedDescription', // ignore initial error of sdk
    ],
    beforeSend(event, hint) {

      if (hint.originalException) {

        // ignore network request failed
        if (isNetworkFail(hint.originalException)) {
          return null;
        }
        // ignore aborts
        if (isAbort(hint.originalException)) {
          return null;
        }
        // ignore user errors
        if (isUserError(hint.originalException)) {
          return null;
        }
        // only log api 500 errors
        if (isApiError(hint.originalException) &&
          (isNaN(hint.originalException.status) || hint.originalException.status < 500)
        ) {
          return null;
        }
      }

      // for dev only log into the console
      if (__DEV__) {
        console.log('sentry', event, hint);
        return null;
      }

      return event;
    }
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

import { Alert } from 'react-native';

import {
  setNativeExceptionHandler,
  setJSExceptionHandler,
} from 'react-native-exception-handler';

// import {onError} from 'mobx-react';
import * as Sentry from '@sentry/react-native';

import shouldReportToSentry from './src/common/helpers/errors';

// Init Sentry (if not running test)
if (process.env.JEST_WORKER_ID === undefined) {
  Sentry.init({
    dsn: 'https://16c9b543563140a0936cc3cd3714481d@sentry.io/1766867',
    ignoreErrors: [
      'Non-Error exception captured with keys: code, domain, localizedDescription', // ignore initial error of sdk
    ],
    beforeSend(event, hint: any) {
      if (hint.originalException) {
        if (!shouldReportToSentry(hint.originalException)) {
          return null;
        }
        if (__DEV__) {
          console.log(
            'Exception',
            hint.originalException,
            hint.originalException?.stack,
          );
        }
      }
      if (__DEV__) {
        return null;
      }
      // for dev only log into the console
      return event;
    },
  });
}

/**
 * react-native-exception-handler global handlers
 */

/**
 * Global error handlers
 */
const jsErrorHandler = (e, isFatal) => {
  if (isFatal) {
    Sentry.captureException(e);
    if (e) {
      Alert.alert(
        'Unexpected error occurred',
        `
          Error: ${isFatal ? 'Fatal:' : ''} ${e.name} ${e.message}
        `,
        [
          {
            text: 'Ok',
          },
        ],
      );
    }

    console.log('Minds Uncaught (fatal)', e.stack);
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
setNativeExceptionHandler(
  exceptionString => {
    Sentry.captureException(new Error(exceptionString), {
      extra: { logger: 'NativeExceptionHandler' },
    });
    console.log('NativeExceptionHandler', exceptionString);
  },
  true,
  false,
);

//@ts-nocheck
import settingsStore from '../../settings/SettingsStore';
// import { withScope, captureException } from '@sentry/react-native/dist/js/sdk';
import shouldReportToSentry from '../helpers/errors';

/**
 * Log service
 */
class LogService {
  log(...args) {
    if (__DEV__) {
      console.log(...args);
    }
    // deviceLog.log(...args);
  }

  info(...args) {
    if (__DEV__) {
      console.info(...args);
    }
    if (!settingsStore.appLog) {
      return;
    }
    // deviceLog.info(...args);
  }

  warn(...args) {
    if (!settingsStore.appLog) {
      return;
    }
    // deviceLog.warn(...args);
  }

  error(...args) {
    console.error(...args);
    // deviceLog.error(...args);
  }

  exception(prepend, error?: any) {
    if (!error) {
      error = prepend;
      prepend = null;
    }

    // log exceptions to console on spec testing or dev mode
    if (process.env.JEST_WORKER_ID !== undefined || __DEV__) {
      console.log(prepend, error);
    }

    if (
      error instanceof Error &&
      shouldReportToSentry(error) &&
      process.env.JEST_WORKER_ID === undefined &&
      !__DEV__
    ) {
      // if (prepend) {
      //   withScope(scope => {
      //     scope.setExtra('where', prepend);
      //     captureException(error);
      //   });
      // } else {
      //   captureException(error);
      // }
    }
  }
}

export default new LogService();

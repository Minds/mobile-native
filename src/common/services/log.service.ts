//@ts-nocheck
import settingsStore from '../../settings/SettingsStore';
import * as Sentry from '@sentry/react-native';
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
      console.log(...args);
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
    // deviceLog.error(...args);
  }

  exception(prepend, error?: Error = undefined) {
    if (!error) {
      error = prepend;
      prepend = null;
    }

    // log exceptions to console on spec testing or dev mode
    if (process.env.JEST_WORKER_ID !== undefined || __DEV__) {
      console.log(prepend, error);
    }

    if (
      shouldReportToSentry(error) &&
      process.env.JEST_WORKER_ID === undefined &&
      !__DEV__
    ) {
      if (prepend) {
        Sentry.withScope(scope => {
          scope.setExtra('where', prepend);
          Sentry.captureException(error);
        });
      } else {
        Sentry.captureException(error);
      }
    }
  }
}

export default new LogService();

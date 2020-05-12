//@ts-nocheck
// import deviceLog from 'react-native-device-log';
import settingsStore from '../../settings/SettingsStore';
import * as Sentry from '@sentry/react-native';
import shouldReportToSentry from '../helpers/errors';

/**
 * Log service
 */
class LogService {
  /**
   * Init service
   */
  init = async () => {
    this._init();
  };

  _init = () => {
    console.log('[LogService] init', settingsStore.appLog);
    // deviceLog.init(AsyncStorage, {
    //   logToConsole: __DEV__,
    //   logRNErrors: true,
    //   logAppState: settingsStore.appLog,
    //   logConnection: settingsStore.appLog,
    //   maxNumberToRender: 500, // 0 or undefined == unlimited
    //   maxNumberToPersist: 500, // 0 or undefined == unlimited
    // });
  };

  log(...args) {
    if (!settingsStore.appLog) {
      return;
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

    // log exceptions to console on spec testing
    if (process.env.JEST_WORKER_ID !== undefined) {
      console.log(error);
    }

    if (
      shouldReportToSentry(error) &&
      process.env.JEST_WORKER_ID === undefined
    ) {
      Sentry.captureException(error);
    }
  }
}

export default new LogService();

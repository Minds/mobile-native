import deviceLog from 'react-native-device-log';
import * as stacktraceParser from "stacktrace-parser";

import AsyncStorage from '@react-native-community/async-storage';
import settingsStore from '../../settings/SettingsStore';
import * as Sentry from '@sentry/react-native';
import { isNetworkFail, isAbort } from '../helpers/abortableFetch';
import { ApiError } from './api.service';
import { isUserError } from '../UserError';

const parseErrorStack = error => {
  if (!error || !error.stack) {
      return null;
  }
  return Array.isArray(error.stack)
      ? error.stack
      : stacktraceParser.parse(error.stack);
};

/**
 * Log service
 */
class LogService {

  /**
   * Init service
   */
  init = async() => {
    this._init();
  }

  _init = () => {
    console.log('[LogService] init', settingsStore.appLog);
    deviceLog.init(AsyncStorage, {
      logToConsole : __DEV__,
      logRNErrors : true,
      logAppState: settingsStore.appLog,
      logConnection: settingsStore.appLog,
      maxNumberToRender : 500, // 0 or undefined == unlimited
      maxNumberToPersist : 500 // 0 or undefined == unlimited
    });
  }

  log(...args) {
    if (!settingsStore.appLog) return;
    deviceLog.log(...args);
  }

  info(...args) {
    if (!settingsStore.appLog) return;
    deviceLog.info(...args);
  }

  warn(...args) {
    if (!settingsStore.appLog) return;
    deviceLog.warn(...args);
  }

  error(...args) {
    deviceLog.error(...args);
  }

  isApiError(error) {
    return error instanceof ApiError;
  }

  isUnexpectedError(error) {
    return !isNaN(error.status) && error.status >= 500;
  }

  exception(prepend, error) {
    if (!error) {
      error = prepend;
      prepend = null;
    }

    if (
      !(error instanceof Error) &&
      !isNetworkFail(error) &&
      !isUserError(error) &&
      !isAbort(error) &&
      (!this.isApiError(error) || this.isUnexpectedError(error))
    ) {
      // report the issue to sentry
      Sentry.captureException(error);

      let stack = null;
      if (__DEV__) {
        stack = parseErrorStack(error);
      }
      if (stack) {
        deviceLog.rnerror(false, (prepend ? `${prepend} ` : '') + error.message, stack);
        if (__DEV__) console.log(error);
      } else {
        deviceLog.error((prepend ? `${prepend} ` : '') + String(error));
      }
    }
  }
}

export default new LogService();

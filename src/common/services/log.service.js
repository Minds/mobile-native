import deviceLog, {LogView, InMemoryAdapter} from 'react-native-device-log';
import * as stacktraceParser from "stacktrace-parser";

import AsyncStorage from '@react-native-community/async-storage';
import storageService from './storage.service';

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
  active = false;

  /**
   * Init service
   */
  init = async() => {
    this.active = await storageService.getItem('AppLogActive');
    this._init();
  }

  /**
   * Activate/Deactivate the app logs
   * @param {boolean} value
   */
  async setActive(value) {
    await storageService.setItem('AppLogActive', !!value);
    this.active = value;
    this._init();
  }

  _init = () => {
    console.log('[LogService] init',this.active);
    deviceLog.init(AsyncStorage, {
      logToConsole : __DEV__,
      logRNErrors : true,
      logAppState: this.active,
      logConnection: this.active,
      maxNumberToRender : 500, // 0 or undefined == unlimited
      maxNumberToPersist : 500 // 0 or undefined == unlimited
    });
  }

  log(...args) {
    if (!this.active) return;
    deviceLog.log(...args);
  }

  info(...args) {
    if (!this.active) return;
    deviceLog.info(...args);
  }

  warn(...args) {
    if (!this.active) return;
    deviceLog.warn(...args);
  }

  error(...args) {
    deviceLog.error(...args);
  }

  exception(prepend, error) {
    if (!error) {
      error = prepend;
      prepend = null;
    }
    let stack = null;
    if (__DEV__) {
      stack = parseErrorStack(error);
    }
    if (stack) {
      deviceLog.rnerror(false, (prepend ? `${prepend} ` : '') + error.message, stack);
    } else {
      deviceLog.error((prepend ? `${prepend} ` : '') + String(error));
    }
  }
}

export default new LogService();
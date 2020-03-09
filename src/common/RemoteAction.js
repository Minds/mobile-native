import connectivityService from './services/connectivity.service';
import {isNetworkFail} from './helpers/abortableFetch';
import i18nService from './services/i18n.service';
import {Alert} from 'react-native';
import { isApiError } from './services/api.service';
import { isUserError } from './UserError';

/**
 * Remote action with auto and manual retry
 *
 * @param {function} action async function that runs the action
 * @param {string} actionName translation term (optional)
 * @param {number} retries number of auto-retries (0 for no auto retry)
 */
async function remoteAction(action, actionName = '', retries = 1) {
  try {
    return await action();
  } catch (error) {
    let message;

    if (isNetworkFail(error)) {
      if (retries > 0) {
        remoteAction(action, actionName, --retries);
        return;
      }
      message = connectivityService.isConnected
        ? i18nService.t('cantReachServer')
        : i18nService.t('noInternet');
    } else if (isApiError(error) || isUserError(error)) {
      message = error.message;
    } else {
      message = i18nService.t('errorMessage');
    }

    if (actionName) {
      message = i18nService.t(actionName) + '\n' + message;
    }

    Alert.alert(
      i18nService.t('sorry'),
      message,
      [
        {text: i18nService.t('ok')},
        {
          text: i18nService.t('tryAgain'),
          onPress: () => remoteAction(action, actionName, retries),
        },
      ],
      {cancelable: true},
    );
  }
}

export default remoteAction;

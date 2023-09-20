//@ts-nocheck
import connectivityService from './services/connectivity.service';
import i18nService from './services/i18n.service';
import { Alert } from 'react-native';
import { isApiError, isNetworkError } from './services/ApiErrors';
import { isUserError } from './UserError';

/**
 * Remote action with auto and manual retry
 *
 * @param {function} action async function that runs the action
 * @param {string} actionName translation term (optional)
 * @param {number} retries number of auto-retries (0 for no auto retry)
 * @param {boolean} showRetry show retry button on error
 */
async function remoteAction(
  action,
  actionName = '',
  retries = 1,
  showRetry = true,
) {
  try {
    return await action();
  } catch (error) {
    let message;

    if (isNetworkError(error)) {
      if (retries > 0) {
        return await remoteAction(action, actionName, --retries);
      }
      message = connectivityService.isConnected
        ? i18nService.t('cantReachServer')
        : i18nService.t('noInternet');
    } else if (isApiError(error) || isUserError(error) || error.message) {
      message = error.message;
    } else {
      console.log('[RemoteAction]', error);
      message = i18nService.t('errorMessage');
    }

    if (actionName) {
      message = i18nService.t(actionName) + '\n' + message;
    }

    const options = [{ text: i18nService.t('ok') }];
    if (showRetry) {
      options.push({
        text: i18nService.t('tryAgain'),
        onPress: () => remoteAction(action, actionName, retries),
      });
    }
    Alert.alert(i18nService.t('sorry'), message, options, { cancelable: true });
  }
}

export default remoteAction;

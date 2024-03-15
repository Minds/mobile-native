import { isApiError, isNetworkError } from '../services/ApiErrors';
import permissionsService from '../services/permissions.service';
import connectivityService from '../services/connectivity.service';
import i18n from '../services/i18n.service';
import { PermissionsEnum } from '~/graphql/api';

/**
 * Returns a network error if the error is a network error or an API error
 * The network error message depends on the connectivity status
 */
export default (error: any) => {
  if (isApiError(error)) {
    if (error.errors?.length) {
      return error.errors.map(e => e.message).join('\n');
    }
    const pattern = /Fordidden: (\w+)(?:\s+is not assigned)?/;
    const match = error.message.match(pattern);
    if (match) {
      return permissionsService.getMessage(match[1] as PermissionsEnum);
    }
    return error.message;
  }

  if (isNetworkError(error)) {
    return connectivityService.isConnected
      ? i18n.t('cantReachServer')
      : i18n.t('noInternet');
  }

  return '';
};

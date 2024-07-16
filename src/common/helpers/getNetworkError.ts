import { isApiError, isNetworkError } from '../services/ApiErrors';
import { PermissionsEnum } from '~/graphql/api';
import sp from '~/services/serviceProvider';

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
      return sp.permissions.getMessage(match[1] as PermissionsEnum);
    }
    return error.message;
  }

  if (isNetworkError(error)) {
    return sp.resolve('connectivity').isConnected
      ? sp.i18n.t('cantReachServer')
      : sp.i18n.t('noInternet');
  }

  return '';
};

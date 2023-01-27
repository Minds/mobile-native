//@ts-nocheck
import { isAbort, isApiError, isNetworkError } from '../services/api.service';
import { isTokenExpired } from '../services/session.service';
import { isUserError } from '../UserError';

export default function shouldReportToSentry(error) {
  const isError = error instanceof Error,
    isNotNetworkFail = !isNetworkError(error),
    isNotUserError = !isUserError(error),
    isNotAbort = !isAbort(error),
    isNotApiError = !isApiError(error),
    isNotTokenExpiredError = !isTokenExpired(error);

  return (
    (isError &&
      isNotNetworkFail &&
      isNotUserError &&
      isNotAbort &&
      isNotTokenExpiredError &&
      (isNotApiError || error.status === 500)) ||
    String(error).indexOf('CodePush') >= 0
  );
}

//@ts-nocheck
import { isAbort, isApiError, isNetworkError } from '../services/api.service';
import { isTokenExpired } from '../services/session.service';
import { isUserError } from '../UserError';

const isUnexpected = error => {
  return !isNaN(error.status) && error.status >= 500;
};

export default function shouldReportToSentry(error) {
  const isError = error instanceof Error,
    isNotNetworkFail = !isNetworkError(error),
    isNotUserError = !isUserError(error),
    isNotAbort = !isAbort(error),
    isNotApiError = !isApiError(error),
    isNotTokenExpiredError = !isTokenExpired(error),
    isUnexpectedError = isUnexpected(error);

  return (
    isError &&
    isNotNetworkFail &&
    isNotUserError &&
    isNotAbort &&
    isNotTokenExpiredError &&
    (isNotApiError || isUnexpectedError)
  );
}

import {
  ApiError,
  isAbort,
  isApiError,
  isNetworkError,
} from '../services/ApiErrors';
import { isTokenExpired } from '../services/TokenExpiredError';
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
      (isNotApiError ||
        (isApiError(error) && (error as ApiError).status === 500))) ||
    String(error).indexOf('CodePush') >= 0
  );
}

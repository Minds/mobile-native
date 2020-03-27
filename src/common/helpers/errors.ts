import { isApiError } from '../services/api.service';
import { isAbort, isNetworkFail } from './abortableFetch';
import { isUserError } from '../UserError';

const isUnexpected = error => {
  return !isNaN(error.status) && error.status >= 500;
};

export default function shouldReportToSentry(error) {
  const isError = error instanceof Error,
    isNotNetworkFail = !isNetworkFail(error),
    isNotUserError = !isUserError(error),
    isNotAbort = !isAbort(error),
    isNotApiError = !isApiError(error),
    isUnexpectedError = isUnexpected(error);

  return (
    isError &&
    isNotNetworkFail &&
    isNotUserError &&
    isNotAbort &&
    (isNotApiError || isUnexpectedError)
  );
}

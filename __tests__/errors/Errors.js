import { ApiError, NetworkError } from '../../src/common/services/ApiErrors';
import shouldReportToSentry from '../../src/common/helpers/errors';
import { UserError } from '../../src/common/UserError';

describe('error handling', () => {
  beforeEach(() => {});

  it('should log random errors', () => {
    const error = new Error();
    expect(shouldReportToSentry(error)).toBe(true);
  });

  it('should log 500s', () => {
    const error = new ApiError('Api Error');
    error.status = 500;
    expect(shouldReportToSentry(error)).toBe(true);
  });

  it('should not log 400s', () => {
    const error = new ApiError('Api Error');
    error.status = 400;
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log non errors', () => {
    const error = {
      message: 'hey, log me!',
      code: 500,
    };
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log Api errors', () => {
    const error = new ApiError('Api Error');
    error.status = 200;
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log User errors', () => {
    const error = new UserError('Sorry');
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log Network errors', () => {
    const error = new NetworkError('Network request failed');
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log Abort errors', () => {
    const error = new Error('Aborted');
    error.__CANCEL__ = true;
    expect(shouldReportToSentry(error)).toBe(false);
  });

  it('should not log NaN errors', () => {
    const error = new ApiError('Api Error');
    error.status = 'error';
    expect(shouldReportToSentry(error)).toBe(false);
  });
});

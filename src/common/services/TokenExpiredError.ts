export class TokenExpiredError extends Error {}

export const isTokenExpired = error => {
  return error instanceof TokenExpiredError;
};

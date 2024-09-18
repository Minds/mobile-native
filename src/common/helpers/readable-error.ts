export const ERRORS = {
  E_INVALID_STORAGE_PASSWORD:
    'You either failed entering your passwords too many times, or cancelled the operation.',
};

export default function readableError(message) {
  if (typeof ERRORS[message] !== 'undefined') {
    return ERRORS[message];
  }

  return message;
}

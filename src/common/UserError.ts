import { showNotification } from '../../AppMessages';

/**
 * User Error
 * Every time a user error exception is thrown a message is show to the user
 */
export class UserError extends Error {
  constructor(message, type: 'info' | 'warning' | 'danger' = 'info') {
    super(message);
    showNotification(message, type);
  }
}

export const isUserError = function (err) {
  return err instanceof UserError;
};

import { showNotification } from '../../AppMessages';

export type UserErrorType = 'info' | 'warning' | 'danger';

/**
 * User Error
 * Every time a user error exception is thrown a message is show to the user
 */
export class UserError extends Error {
  constructor(message, type: UserErrorType = 'info', onPress?: () => void) {
    super(message);
    showNotification(message, type, 3000, undefined, false, onPress);
  }
}

export const isUserError = function (err) {
  return err instanceof UserError;
};

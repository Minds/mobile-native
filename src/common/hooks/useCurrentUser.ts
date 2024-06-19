import { sessionService } from '~/common/services';
import type UserModel from '../../channel/UserModel';

/**
 * Returns an instance of the current user or null if it is logged out
 */
export default function useCurrentUser(): UserModel | null {
  if (sessionService.userLoggedIn) {
    return sessionService.getUser();
  }
  return null;
}

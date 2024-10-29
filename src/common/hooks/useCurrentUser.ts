import type UserModel from '../../channel/UserModel';
import sp from '~/services/serviceProvider';
/**
 * Returns an instance of the current user or null if it is logged out
 */
export default function useCurrentUser(): UserModel | null {
  const sessionService = sp.session;
  if (sessionService.userLoggedIn) {
    return sessionService.getUser();
  }
  return null;
}

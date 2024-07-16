import { getStores } from 'AppStores';
import sp from '~/services/serviceProvider';

/**
 * Checks if users needs to agree TOS
 */
export default function checkTOS() {
  if (sp.session.userLoggedIn && !sp.session.switchingAccount) {
    const settings = sp.config.getSettings();
    if (settings.last_accepted_tos) {
      const { user: userStore } = getStores();
      if (
        !userStore.me.last_accepted_tos ||
        !settings.last_accepted_tos ||
        userStore.me.last_accepted_tos >= settings.last_accepted_tos
      ) {
        return;
      }
      sp.navigation.navigate('TosScreen');
    }
  }
}

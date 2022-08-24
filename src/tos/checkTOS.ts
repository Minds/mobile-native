import sessionService from '~/common/services/session.service';
import mindsConfigService from '~/common/services/minds-config.service';
import { getStores } from 'AppStores';
import NavigationService from '~/navigation/NavigationService';

/**
 * Checks if users needs to agree TOS
 */
export default function checkTOS() {
  if (sessionService.userLoggedIn && !sessionService.switchingAccount) {
    const settings = mindsConfigService.getSettings();
    if (settings.last_accepted_tos) {
      const { user: userStore } = getStores();
      if (
        !userStore.me.last_accepted_tos ||
        !settings.last_accepted_tos ||
        userStore.me.last_accepted_tos >= settings.last_accepted_tos
      ) {
        return;
      }
      NavigationService.navigate('TosScreen');
    }
  }
}

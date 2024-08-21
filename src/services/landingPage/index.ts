import mindsConfigService from '~/common/services/minds-config.service';
import { LANDING_PAGE_LOGGED_IN } from '~/config/Config';

export function getLandingPage() {
  return (
    mindsConfigService.getSettings().tenant?.logged_in_landing_page_id_mobile ||
    LANDING_PAGE_LOGGED_IN
  );
}

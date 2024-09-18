import { LANDING_PAGE_LOGGED_IN } from '~/config/Config';
import sp from '~/services/serviceProvider';

/**
 * Get the landing page for the app
 */
export function getLandingPage() {
  return (
    sp.config.getSettings().tenant?.logged_in_landing_page_id_mobile ||
    LANDING_PAGE_LOGGED_IN
  );
}

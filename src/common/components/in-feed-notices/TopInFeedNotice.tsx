import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import { NoticeName, noticeMapper } from './notices';

/**
 * Current top in-feed notice
 */
function TopInFeedNotice() {
  const notice = inFeedNoticesService.getTopNotice<NoticeName>();
  return notice ? noticeMapper[notice] : null;
}

export default observer(TopInFeedNotice);

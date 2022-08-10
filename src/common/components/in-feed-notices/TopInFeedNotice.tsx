import React from 'react';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import InFeedNoticeMapper from './InFeedNoticeMapper';

/**
 * Current top in-feed notice
 */
function TopInFeedNotice() {
  const notice = inFeedNoticesService.getTopNotice();

  return notice ? <InFeedNoticeMapper noticeName={notice} /> : null;
}

export default observer(TopInFeedNotice);

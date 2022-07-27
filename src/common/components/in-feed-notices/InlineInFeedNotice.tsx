import React from 'react';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import InFeedNoticeMapper from './InFeedNoticeMapper';

type PropsType = {
  position?: number;
};

/**
 * Current top in-feed notice
 */
function InlineInFeedNotice({ position = 1 }: PropsType) {
  const notice = inFeedNoticesService.getInlineNotice(position);

  console.log('InlineInFeedNotice', notice);

  return notice ? <InFeedNoticeMapper noticeName={notice} /> : null;
}

export default observer(InlineInFeedNotice);

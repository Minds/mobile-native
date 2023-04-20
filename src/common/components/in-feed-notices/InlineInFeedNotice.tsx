import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import { getNotice } from './notices';

type PropsType = {
  position?: number;
};

/**
 * Current top in-feed notice
 */

function InlineInFeedNotice({ position = 1 }: PropsType) {
  const notice = inFeedNoticesService.getInlineNotice(position);
  return notice ? getNotice(notice) : null;
}

export default observer(InlineInFeedNotice);

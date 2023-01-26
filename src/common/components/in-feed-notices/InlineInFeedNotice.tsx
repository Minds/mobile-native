import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { observer } from 'mobx-react';
import { NoticeName, noticeMapper } from './notices';

type PropsType = {
  position?: number;
};

/**
 * Current top in-feed notice
 */

function InlineInFeedNotice({ position = 1 }: PropsType) {
  const notice = inFeedNoticesService.getInlineNotice<NoticeName>(position);
  return notice ? noticeMapper[notice] : null;
}

export default observer(InlineInFeedNotice);

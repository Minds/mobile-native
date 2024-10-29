import { observer } from 'mobx-react';
import { getNotice } from './notices';
import serviceProvider from '~/services/serviceProvider';

type PropsType = {
  position?: number;
};

/**
 * Current top in-feed notice
 */

function InlineInFeedNotice({ position = 1 }: PropsType) {
  const notice = serviceProvider
    .resolve('inFeedNotices')
    .getInlineNotice(position);
  return notice ? getNotice(notice) : null;
}

export default observer(InlineInFeedNotice);

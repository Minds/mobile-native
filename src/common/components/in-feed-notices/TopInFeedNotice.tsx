import { observer } from 'mobx-react';
import { getNotice } from './notices';
import serviceProvider from '~/services/serviceProvider';

/**
 * Current top in-feed notice
 */
function TopInFeedNotice() {
  const notice = serviceProvider.resolve('inFeedNotices').getTopNotice();
  return notice ? getNotice(notice) : null;
}

export default observer(TopInFeedNotice);

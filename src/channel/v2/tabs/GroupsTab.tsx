import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import GroupModel from '~/groups/GroupModel';
import FeedStore from '~/common/stores/FeedStore';
import GroupsListItem from '~/groups/GroupsListItem';

// TODO: to refactor this tab to use feedlist #5264
const Groups = observer(() => {
  const { current: groupStore } = useRef(new FeedStore<GroupModel>());
  useEffect(() => {
    groupStore
      .setEndpoint('api/v1/groups/member')
      .setLimit(120)
      .setInjectBoost(false)
      .setAsActivities(true)
      .setParams({ nsfw: [] })
      .fetchRemoteOrLocal();
  }, [groupStore]);

  return (
    <>
      {groupStore.loading && <CenteredLoading />}
      {groupStore.entities
        .slice()
        .map(group =>
          group instanceof GroupModel ? (
            <GroupsListItem group={group} key={group.guid} />
          ) : null,
        )}
    </>
  );
});

export default withErrorBoundary(Groups);

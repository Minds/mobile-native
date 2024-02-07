import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';

import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import GroupModel from '~/groups/GroupModel';
import FeedStore from '~/common/stores/FeedStore';
import GroupsListItem from '~/groups/GroupsListItem';
import { ChannelStoreType } from '../createChannelStore';

// TODO: to refactor this tab to use feedlist #5264
const Groups = observer(({ store }: { store: ChannelStoreType }) => {
  const { current: groupStore } = useRef(new FeedStore<GroupModel>());
  useEffect(() => {
    groupStore
      .setEndpoint(`/api/v3/channel/${store.channel?.guid}/groups`)
      .setLimit(120)
      .setInjectBoost(false)
      .setAsActivities(true)
      .setParams({ nsfw: [] })
      .fetchRemoteOrLocal();
  }, [groupStore, store.channel]);

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

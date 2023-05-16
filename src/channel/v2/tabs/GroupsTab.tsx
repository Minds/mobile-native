import { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';

import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import { ChannelStoreType } from '../createChannelStore';
import GroupModel from '~/groups/GroupModel';
import groupsService from '~/groups/GroupsService';
import GroupsListItem from '~/groups/GroupsListItem';

type PropsType = {
  store: ChannelStoreType;
};

const Groups = observer(({ store }: PropsType) => {
  const ownChannel = store?.channel?.isOwner();

  const localStore = useLocalStore(() => ({
    groups: [] as GroupModel[],
    loading: true,
    init(list: GroupModel[]) {
      this.groups = list;
      this.loading = false;
    },
  }));

  useEffect(() => {
    if (localStore.loading) {
      (async () => {
        if (ownChannel) {
          const { entities } = await groupsService.loadList('member', 0);
          localStore.init(entities);
        } else {
          const list = await store.getGroupList();
          localStore.init(list);
        }
      })();
    }
  }, [localStore, ownChannel, store]);

  return (
    <>
      {localStore.loading && <CenteredLoading />}
      {localStore.groups?.map(group => (
        <GroupsListItem group={group} key={group.guid} noNavigate />
      ))}
    </>
  );
});

export default withErrorBoundary(Groups);

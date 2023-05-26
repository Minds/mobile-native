import React, { createContext, useContext } from 'react';
import type GroupModel from '~/groups/GroupModel';
import {
  GroupFeedStoreType,
  useGroupFeedStore,
} from '../hooks/useGroupFeedStore';
import {
  GroupMembersStoreType,
  useGroupMembersStore,
} from '../hooks/useGroupMembersStore';

/**
 * GroupContext
 */
export const GroupContext = createContext<null | {
  group: GroupModel;
  feedStore?: GroupFeedStoreType;
  feedMembersStore?: GroupMembersStoreType;
}>(null);

export const GroupScreenContextProvider = ({
  group,
  children,
}: {
  group: GroupModel;
  children: React.ReactNode;
}) => {
  const feedStore = useGroupFeedStore(group);
  const feedMembersStore = useGroupMembersStore(group);
  const context = { feedStore, feedMembersStore, group };
  return <GroupContext.Provider value={context} children={children} />;
};

export function useGroupContext() {
  return useContext(GroupContext);
}

export const GroupContextProvider = ({
  group,
  children,
}: {
  group: GroupModel | null;
  children: React.ReactNode;
}) => {
  return (
    <GroupContext.Provider
      value={group ? { group } : null}
      children={children}
    />
  );
};

import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { useHeaderTabContext } from 'showtime-tab-view';

import { TabFlashListScrollView } from './TabFlashListScrollView';

import { GroupMembersList, GroupMembersListProps } from './GroupMembersList';
import type UserModel from '~/channel/UserModel';

export type TabMemberListProps = Omit<
  GroupMembersListProps,
  'renderScrollComponent'
> & {
  index: number;
};

function TabFeedListComponent(
  props: GroupMembersListProps,
  ref: React.Ref<FlashList<UserModel>>,
) {
  const { scrollViewPaddingTop } = useHeaderTabContext();

  return (
    <GroupMembersList
      {...props}
      renderScrollComponent={TabFlashListScrollView as any}
      contentContainerStyle={{ paddingTop: scrollViewPaddingTop }}
      ref={ref}
    />
  );
}

export const TabMemberList = React.forwardRef(TabFeedListComponent) as (
  props: TabMemberListProps & {
    ref?: React.Ref<FlashList<UserModel>>;
  },
) => React.ReactElement;

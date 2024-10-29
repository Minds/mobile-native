import React, { useCallback } from 'react';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { observer } from 'mobx-react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import truncate from 'lodash/truncate';

import { FLAG_APPOINT_MODERATOR } from '~/common/Permissions';
import GroupMemberListItem from '~/groups/GroupMemberListItem';
import UserModel from '~/channel/UserModel';
import type GroupModel from '~/groups/GroupModel';
import CenteredLoading from '~/common/components/CenteredLoading';
import {
  BottomSheetMenuItem,
  BottomSheetMenuItemProps,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import { confirm } from '~/common/components/Confirm';
import { GroupMembersStoreType } from '../hooks/useGroupMembersStore';
import { useGroupContext } from '../contexts/GroupContext';

import sp from '~/services/serviceProvider';

export type GroupMembersListProps = {
  group: GroupModel;
  index: number;
} & Omit<
  FlashListProps<UserModel>,
  'data' | 'getItemType' | 'keyExtractor' | 'renderItem'
>;

function GroupMembersFlashList(
  { group, ...other }: GroupMembersListProps,
  ref: React.Ref<FlashList<UserModel>>,
) {
  const context = useGroupContext();
  if (!context) {
    throw new Error('Context needed');
  }
  const store = context.feedMembersStore;

  const renderRow = useCallback(
    row => {
      return (
        <GroupMemberListItem
          channel={row.item}
          onMenuPress={() => {
            if (store) {
              memberMenuPress(row.item, group, store);
            }
          }}
          isOwner={group['is:owner']}
          isModerator={group['is:moderator']}
        />
      );
    },
    [group, store],
  );

  return store ? (
    <View
      style={[
        sp.styles.style.flexContainer,
        sp.styles.style.alignSelfCenterMaxWidth,
      ]}>
      <FlashList
        estimatedItemSize={75}
        data={store.members.entities.slice()}
        refreshing={store.members.refreshing}
        onEndReachedThreshold={5}
        ListFooterComponent={() => <Footer store={store} />}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        onEndReached={() => store.loadMore()}
        {...other}
        ref={ref}
      />
    </View>
  ) : null;
}

const Footer = observer(({ store }) => {
  return store.loading ? <CenteredLoading /> : null;
});

const keyExtractor = item => item.guid;

export const GroupMembersList = observer(
  React.forwardRef(GroupMembersFlashList) as (
    props: GroupMembersListProps & {
      ref?: React.Ref<FlashList<UserModel>>;
    },
  ) => React.ReactElement,
);

const memberMenuPress = (
  member: UserModel,
  group: GroupModel,
  store: GroupMembersStoreType,
) => {
  const i18n = sp.i18n;
  pushBottomSheet({
    title: truncate(member.name, {
      length: 25,
      separator: ' ',
    }),
    component: (bottomSheetRef, handleContentLayout) => {
      const memberActions: Array<BottomSheetMenuItemProps> = [];
      const imOwner = group['is:owner'];
      const imModerator = group['is:moderator'];

      if (imOwner) {
        if (member['is:owner']) {
          memberActions.push({
            title: i18n.t('groups.removeAdmin'),
            iconName: 'delete',
            iconType: 'material-community',
            onPress: () => {
              bottomSheetRef.close();
              store.revokeOwner(member);
            },
          });
        } else if (!member['is:moderator']) {
          memberActions.push({
            title: i18n.t('groups.makeAdmin'),
            iconName: 'person-circle-outline',
            iconType: 'ionicon',
            onPress: () => {
              bottomSheetRef.close();
              store.makeOwner(member);
            },
          });
          if (group.can(FLAG_APPOINT_MODERATOR)) {
            memberActions.push({
              title: i18n.t('groups.makeModerator'),
              iconName: 'add-moderator',
              iconType: 'material',
              onPress: () => {
                bottomSheetRef.close();
                store.makeModerator(member);
              },
            });
          }
        } else {
          if (group.can(FLAG_APPOINT_MODERATOR)) {
            memberActions.push({
              title: i18n.t('groups.removeModerator'),
              iconName: 'remove-moderator',
              iconType: 'material',
              onPress: () => {
                bottomSheetRef.close();
                store.revokeModerator(member);
              },
            });
          }
        }
      }

      if (
        (imOwner || imModerator) &&
        !member['is:owner'] &&
        !member['is:moderator']
      ) {
        memberActions.push({
          title: i18n.t('groups.kick'),
          iconName: 'exit-outline',
          iconType: 'ionicon',
          onPress: () => {
            bottomSheetRef.close();
            Alert.alert(i18n.t('confirm'), i18n.t('groups.confirmKick'), [
              { text: i18n.t('no'), style: 'cancel' },
              {
                text: i18n.t('yes'),
                onPress: () => store.kick(member),
              },
            ]);
          },
        });
        memberActions.push({
          title: i18n.t('groups.ban'),
          iconName: 'prohibited',
          iconType: 'foundation',
          onPress: () => {
            bottomSheetRef.close();
            // we wait for the previous bottomsheet is closed
            setTimeout(async () => {
              const result = await confirm({
                title: i18n.t('groups.banConfirm'),
              });
              if (result) {
                store.ban(member);
              }
            }, 400);
          },
        });
      }
      return (
        <SafeAreaView edges={['bottom']} onLayout={handleContentLayout}>
          {memberActions.map((o, i) => (
            <BottomSheetMenuItem {...o} key={i} />
          ))}
        </SafeAreaView>
      );
    },
  });
};

import React, { forwardRef } from 'react';

import { observer } from 'mobx-react';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
} from '~/common/components/bottom-sheet';
import { copyToClipboardOptions } from '~/common/helpers/copyToClipboard';
import { APP_URI, BOOSTS_ENABLED } from '~/config/Config';
import GroupModel from '~/groups/GroupModel';
import { GroupContextType, useGroupContext } from '../contexts/GroupContext';
import { useDeleteGroupChatRoom } from '~/modules/chat/hooks/useDeleteGroupChatRoom';
import { confirm } from '~/common/components/Confirm';
import { useIsFeatureOn } from 'ExperimentsProvider';
import serviceProvider from '~/services/serviceProvider';

type PropsType = {
  group: GroupModel;
  onSearchGroupPressed: () => void;
};

type OptionsProps = PropsType & {
  ref: any;
  groupContext: GroupContextType;
};

/**
 * Get menu options
 * @param group
 */
const getOptions = ({
  group,
  onSearchGroupPressed,
  ref,
  groupContext,
}: OptionsProps) => {
  let options: Array<{
    iconName: string;
    iconType: string;
    title: string;
    onPress: () => void;
  }> = [];

  const link = `${APP_URI}group/${group.guid}/feed`;
  const i18n = serviceProvider.i18n;

  if (serviceProvider.permissions.canBoost() && BOOSTS_ENABLED) {
    options.push({
      iconName: 'trending-up',
      iconType: 'material',
      title: i18n.t('group.boost'),
      onPress: () => {
        serviceProvider.navigation.navigate('BoostScreenV2', {
          entity: group,
          boostType: 'group',
        });

        ref.current.dismiss();
      },
    });
  }

  options.push({
    iconName: 'search',
    iconType: 'material',
    title: i18n.t('group.search'),
    onPress: () => {
      onSearchGroupPressed();
      ref.current.dismiss();
    },
  });

  options.push(copyToClipboardOptions(link, () => ref.current?.dismiss()));

  options.push({
    iconName: 'share',
    iconType: 'material',
    title: i18n.t('group.share'),
    onPress: () => {
      serviceProvider.resolve('share').share(i18n.t('group.share'), link);
      ref.current.dismiss();
    },
  });

  if (group['is:owner'] && BOOSTS_ENABLED) {
    options.push({
      iconName: group.show_boosts ? 'remove' : 'done',
      iconType: 'material',
      title: group.show_boosts
        ? i18n.t('group.disableBoost')
        : i18n.t('group.enableBoost'),
      onPress: () => {
        groupContext?.group.toggleShowBoosts(!group.show_boosts);
        groupContext?.feedStore?.feed.setInjectBoost(
          Boolean(group.show_boosts),
        );
        groupContext?.feedStore?.feed.refresh();

        ref.current.dismiss();
      },
    });
  }

  return options;
};

/**
 * Group More Menu (action sheet)
 * @param props
 */
const GroupMoreMenu = forwardRef((props: PropsType, ref: any) => {
  const groupContext = useGroupContext();
  const options = getOptions({ ...props, ref, groupContext });
  const deleteMutaton = useDeleteGroupChatRoom(props.group);

  const featureEnabled = useIsFeatureOn('mobile-create-group-chat-new');

  // remove chat option only for owner
  if (
    featureEnabled &&
    props.group.isOwner() &&
    !props.group.conversationDisabled
  ) {
    options.push({
      iconName: 'message',
      iconType: 'material-community',
      title: 'Delete chat room',
      onPress: () => {
        confirm({
          title: 'Delete chat room',
          description: 'Are you sure you want to delete this chat room?',
          actionText: 'Delete',
        }).then(() => {
          deleteMutaton.deleteChatRoom();
          ref.current.dismiss();
        });
        ref.current.dismiss();
      },
    });
  }

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  return (
    <BottomSheetModal ref={ref}>
      {options.map((b, i) => (
        <BottomSheetMenuItem {...b} key={i} />
      ))}
      <BottomSheetButton
        text={serviceProvider.i18n.t('cancel')}
        onPress={close}
      />
    </BottomSheetModal>
  );
});

export default observer(GroupMoreMenu);

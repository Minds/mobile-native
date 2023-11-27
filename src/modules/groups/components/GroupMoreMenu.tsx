import React, { forwardRef } from 'react';

import i18n from '~/common/services/i18n.service';
import shareService from '../../../share/ShareService';
import { observer } from 'mobx-react';
import {
  BottomSheetModal,
  BottomSheetButton,
  BottomSheetMenuItem,
} from '~/common/components/bottom-sheet';
import { copyToClipboardOptions } from '~/common/helpers/copyToClipboard';
import { MINDS_URI } from '~/config/Config';
import GroupModel from '~/groups/GroupModel';
import NavigationService from '../../../navigation/NavigationService';
import { GroupContextType, useGroupContext } from '../contexts/GroupContext';
import PermissionsService from '~/common/services/permissions.service';

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

  const link = `${MINDS_URI}group/${group.guid}/feed`;

  if (PermissionsService.canBoost()) {
    options.push({
      iconName: 'trending-up',
      iconType: 'material',
      title: i18n.t('group.boost'),
      onPress: () => {
        NavigationService.navigate('BoostScreenV2', {
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
      shareService.share(i18n.t('group.share'), link);
      ref.current.dismiss();
    },
  });

  if (group['is:owner']) {
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

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  return (
    <BottomSheetModal ref={ref}>
      {options.map((b, i) => (
        <BottomSheetMenuItem {...b} key={i} />
      ))}
      <BottomSheetButton text={i18n.t('cancel')} onPress={close} />
    </BottomSheetModal>
  );
});

export default observer(GroupMoreMenu);

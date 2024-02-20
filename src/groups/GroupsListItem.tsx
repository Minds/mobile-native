import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import * as entities from 'entities';

import MenuItem from '../common/components/menus/MenuItem';
import abbrev from '../common/helpers/abbrev';
import i18n from '../common/services/i18n.service';
import { B2, Icon, Row } from '../common/ui';
import GroupModel from './GroupModel';
import capitalize from '~/common/helpers/capitalize';
import SubscribeButton from '~/modules/groups/components/SubscribeButton';

type PropsType = {
  group: GroupModel;
  onPress?: () => void;
  hideButton?: boolean;
  index?: number;
  noNavigate?: boolean;
};

const GroupsListItem = observer((props: PropsType) => {
  const navigation = useNavigation();
  const group = GroupModel.checkOrCreate(props.group);
  const avatarSource = group.getAvatar();

  const _onPress = useCallback(() => {
    if (!props.noNavigate) {
      navigation.navigate('GroupView', {
        group: group,
        scrollToBottom: true,
      });
    }
  }, [group, navigation, props.noNavigate]);

  if (!group) {
    return null;
  }

  return (
    <MenuItem
      alignTop
      avatar={avatarSource?.source}
      title={group.name}
      onPress={_onPress}
      isRightIconButton
      icon={
        !props.hideButton && (
          <SubscribeButton
            group={group}
            onPress={props.onPress}
            testID={`suggestedGroup${props.index}`}
          />
        )
      }
      borderless>
      <>
        <B2 top="XS">
          {abbrev(group['members:count'])}{' '}
          <B2 color="secondary">{i18n.t('members').toLocaleLowerCase()}</B2>
        </B2>
        {group.brief_description?.length > 0 && (
          <B2 numberOfLines={2} color="secondary" right="XL" top="XS">
            {entities.decodeHTML(capitalize(group.brief_description))}
          </B2>
        )}
        {group.boosted && <BoostedGroupLabel />}
      </>
    </MenuItem>
  );
});

const BoostedGroupLabel = () => (
  <Row top="XS" align="centerStart">
    <Icon name="boost" size="tiny" right="XS" color="Link" />
    <B2 color="link">{i18n.t('boosts.boostedGroup')}</B2>
  </Row>
);

export default GroupsListItem;

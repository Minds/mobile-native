import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import * as entities from 'entities';

import MenuItem from '../common/components/menus/MenuItem';
import abbrev from '../common/helpers/abbrev';
import { FLAG_JOIN } from '../common/Permissions';
import i18n from '../common/services/i18n.service';
import { B2, Button, Icon, Row } from '../common/ui';
import GroupModel from './GroupModel';
import capitalize from '~/common/helpers/capitalize';

const HITSLOP = {
  hitSlop: 10,
};

type PropsType = {
  group: GroupModel;
  onPress?: () => void;
  hideButton?: boolean;
  index?: number;
  noNavigate?: boolean;
};

type ButtonPropsType = {
  group: GroupModel;
  index?: number;
  onPress?: () => void;
};

const JoinButton = observer(({ group, index, ...props }: ButtonPropsType) => {
  const isMember = group['is:member'];

  const onPress = useCallback(() => {
    if (isMember) {
      group.leave();
    } else {
      if (group.can(FLAG_JOIN, true)) {
        group.join();
        props.onPress?.();
      }
    }
  }, [group, isMember, props]);

  return (
    <Button
      mode="outline"
      type={isMember ? 'base' : 'action'}
      size="tiny"
      onPress={onPress}
      pressableProps={HITSLOP}
      testID={`suggestedGroup${index}`}>
      {isMember ? 'Joined' : 'Join'}
    </Button>
  );
});

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
      icon={
        !props.hideButton && (
          <JoinButton
            index={props.index}
            group={group}
            onPress={props.onPress}
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

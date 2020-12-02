import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import abbrev from '../common/helpers/abbrev';
import { FLAG_JOIN } from '../common/Permissions';
import i18n from '../common/services/i18n.service';
import ListItemButton from '../common/components/ListItemButton';
import GroupModel from './GroupModel';
import ThemedStyles from '../styles/ThemedStyles';
import { useNavigation } from '@react-navigation/native';

type PropsType = {
  group: GroupModel;
  onPress?: Function;
  hideButton?: boolean;
  index?: number;
  noNavigate?: boolean;
};

type ButtonPropsType = {
  group: GroupModel;
  index?: number;
};

const Button = observer(({ group, index }: ButtonPropsType) => {
  const theme = ThemedStyles.style;
  const isMember = group['is:member'];
  let onPress, iconName, style;
  if (isMember) {
    onPress = () => group.leave();
    iconName = 'check';
    style = theme.colorLink;
  } else {
    onPress = group.can(FLAG_JOIN, true) ? () => group.join() : () => {};
    iconName = 'add';
    style = theme.colorIcon;
  }
  return (
    <ListItemButton onPress={onPress} testID={`suggestedGroup${index}`}>
      <Icon name={iconName} size={26} style={style} />
    </ListItemButton>
  );
});

const GroupsListItem = observer((props: PropsType) => {
  const navigation = useNavigation();
  const theme = ThemedStyles.style;
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
    <ListItem
      containerStyle={styles.container}
      title={group.name}
      titleStyle={[styles.title, theme.colorPrimaryText]}
      leftAvatar={avatarSource}
      subtitle={i18n.t('groups.listMembersCount', {
        count: abbrev(group['members:count']),
      })}
      subtitleStyle={[styles.subtitle, theme.colorSecondaryText]}
      onPress={_onPress}>
      {!props.hideButton && <Button index={props.index} group={group} />}
    </ListItem>
  );
});

export default GroupsListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
  },
});

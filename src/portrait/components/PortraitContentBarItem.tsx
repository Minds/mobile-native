import { observer } from 'mobx-react';
import React from 'react';
import excerpt from '~/common/helpers/excerpt';
import { Icon } from '~/common/ui/icons';
import navigationService from '~/navigation/NavigationService';
import ThemedStyles from '~/styles/ThemedStyles';
import { Avatar, B3, Column } from '~ui';

type PropsType = {
  avatarUrl?: any;
  unseen?: boolean;
  title: string;
  onPress?: any;
  withPlus?: boolean;
  guid?: string;
};

/**
 * Portrait content bar items
 * @param props Props
 */
export default observer(function PortraitContentBarItem(props: PropsType) {
  const onPress = React.useCallback(() => {
    navigationService.push('PortraitViewerScreen', {
      guid: props.guid,
    });
  }, [props.guid]);

  return (
    <Column align="centerBoth" horizontal="XS">
      <Avatar
        source={props.avatarUrl}
        onPress={props.onPress ? props.onPress : onPress}
        border={props.unseen ? 'active' : 'transparent'}
        size="medium">
        {props.withPlus && <PlusIcon />}
      </Avatar>
      <B3 top="XXS" align="center">
        {excerpt(props.title, 10)}
      </B3>
    </Column>
  );
});

const PlusIcon = () => (
  <Icon style={styles.plusIcon} name="plus-circle" color="Link" />
);

const styles = ThemedStyles.create({
  container: {
    padding: 10,
    overflow: 'visible',
  },
  text: {
    marginTop: 8,
  },
  unseen: {
    zIndex: 9990,
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2.2,
    borderRadius: 30,
    position: 'absolute',
    borderColor: '#ECDA51',
  },
  avatar: [
    'bgTertiaryBackground',
    {
      height: 55,
      width: 55,
      borderRadius: 27.5,
    },
  ],
  plusIcon: [
    {
      position: 'absolute',
      right: -5,
      bottom: -5,
      borderRadius: 100,
    },
    'bgPrimaryBackground',
  ],
});

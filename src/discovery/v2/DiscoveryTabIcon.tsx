import { observer } from 'mobx-react';
import React from 'react';
import MIcon from '@expo/vector-icons/MaterialIcons';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { IIconSize, Icon } from '~ui/icons';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import sp from '~/services/serviceProvider';

type PropsType = {
  size?: IIconSize;
  active: boolean;
  icon?: string;
  style?: ViewStyle;
};

const DiscoveryTabIcon = observer((props: PropsType) => {
  const { active, size = 'large', style } = props;
  const { badgeVisible } = useDiscoveryV2Store();

  return (
    <>
      {props.icon !== undefined ? (
        <MIcon
          size={28}
          active={active}
          // @ts-ignore
          name={props.icon.replace('_', '-')}
          style={[
            style,
            active
              ? sp.styles.style.colorPrimaryText
              : sp.styles.style.colorIcon,
          ]}
        />
      ) : (
        <Icon
          name="search"
          size={size}
          active={active}
          activeColor="PrimaryText"
          style={style}
        />
      )}
      {badgeVisible ? <View style={styles.unread} /> : undefined}
    </>
  );
});

const styles = StyleSheet.create({
  unread: {
    position: 'absolute',
    top: -5,
    right: 0,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: sp.styles.style.colorLink.color,
  },
});

export default DiscoveryTabIcon;

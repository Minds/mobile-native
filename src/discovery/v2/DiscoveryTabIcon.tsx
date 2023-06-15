import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { IIconSize, Icon } from '~ui/icons';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  size?: IIconSize;
  active: boolean;
  style?: ViewStyle;
};

const DiscoveryTabIcon = observer((props: PropsType) => {
  const { active, size = 'large', style } = props;
  const { badgeVisible } = useDiscoveryV2Store();

  return (
    <>
      <Icon
        name="search"
        size={size}
        active={active}
        activeColor="PrimaryText"
        style={style}
      />
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
    backgroundColor: ThemedStyles.style.colorLink.color,
  },
});

export default DiscoveryTabIcon;

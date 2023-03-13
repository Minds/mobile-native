import { observer } from 'mobx-react';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from '~ui/icons';
import { useDiscoveryV2Store } from './useDiscoveryV2Store';

type PropsType = {
  size?: number;
  active: boolean;
};

const DiscoveryTabIcon = observer((props: PropsType) => {
  const active = props.active;
  const { badgeVisible } = useDiscoveryV2Store();

  return (
    <>
      <Icon
        size="large"
        name="search"
        active={active}
        activeColor="PrimaryText"
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
    backgroundColor: '#1B85D6',
  },
});

export default DiscoveryTabIcon;

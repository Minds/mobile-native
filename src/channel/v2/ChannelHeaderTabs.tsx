import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react';
import type { ChannelStoreType } from './createChannelStore';

type PropsType = {
  store: ChannelStoreType;
};

/**
 * Channels tabs
 */
const ChannelHeaderTabs = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const tabStyle = [
    theme.paddingVertical,
    theme.paddingHorizontal2x,
    theme.borderBottom3x,
  ];

  const tab = props.store.tab;

  return (
    <View
      style={[
        theme.paddingHorizontal4x,
        theme.rowJustifyStart,
        theme.borderBottom,
        theme.borderPrimary,
      ]}>
      <TouchableOpacity
        onPress={() => props.store.setTab('feed')}
        style={[
          tabStyle,
          tab === 'feed' ? theme.borderLink : theme.borderBackgroundSecondary,
        ]}>
        <Text style={theme.fontL}>Feed</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.store.setTab('shop')}
        style={[
          tabStyle,
          tab === 'shop' ? theme.borderLink : theme.borderBackgroundSecondary,
        ]}>
        <Text style={theme.fontL}>Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.store.setTab('about')}
        style={[
          tabStyle,
          tab === 'about' ? theme.borderLink : theme.borderBackgroundSecondary,
        ]}>
        <Text style={theme.fontL}>About</Text>
      </TouchableOpacity>
    </View>
  );
});

export default ChannelHeaderTabs;

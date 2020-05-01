import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import colors from '../../../styles/Colors';
import ThemedStyles from '../../../styles/ThemedStyles';
import { useTopbarBarStore } from './TopbarTabbarContext';

interface Props {
  id: string;
  children: string;
  //onPress: (e: GestureResponderEvent) => {};
  style?: StyleProp<ViewStyle>;
}

/**
 * Topbar Tabbar Item
 */
export const TopbarTabbarItem = observer((props: Props) => {
  const store = useTopbarBarStore();

  const isSelected = (): ViewStyle | null => {
    // const activeTabId = store.activeTabId;
    // return activeTabId == txt ? styles.tabSelected : null;
    return store.activeTabId === props.id ? styles.tabSelected : null;
  };

  const onPress = (e: GestureResponderEvent) => {
    store.setActiveTabId(props.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.tab,
        {
          borderBottomColor: ThemedStyles.getColor('secondary_background'),
        },
        isSelected(),
      ]}
      onPress={onPress}>
      <Text style={CommonStyle.fontM}>{props.children}</Text>
    </TouchableOpacity>
  );
});

export default TopbarTabbarItem;

//TODO: move to common style
const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    paddingHorizontal: 0,
    marginRight: 20,
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  },
});

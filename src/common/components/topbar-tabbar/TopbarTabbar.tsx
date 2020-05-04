import React, { Component, ReactChildren, Children, useEffect } from 'react';

import { inject, observer, useLocalStore } from 'mobx-react';

import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import {
  useTopbarBarStore,
  storesContext,
  createStore,
} from './TopbarTabbarContext';
import type TopbarTabbarItem from './TopbarTabbarItem';

interface Props {
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  children: typeof TopbarTabbarItem[] | any;
}

/**
 * Topbar Tabbar
 */
export const TopbarTabbar = observer((props: Props) => {
  const store = useLocalStore(createStore);

  useEffect(() => {
    store.setActiveTabId(props.activeTabId);
  }, [props.activeTabId]);

  useEffect(() => {
    if (store.activeTabId && props.activeTabId !== store.activeTabId)
      props.onTabChange(store.activeTabId);
  }, [store.activeTabId]);

  return (
    <View>
      <storesContext.Provider value={store}>
        <View
          style={[
            styles.container,
            ThemedStyles.style.borderBottomHair,
            ThemedStyles.style.borderPrimary,
            ThemedStyles.style.backgroundSecondary,
          ]}>
          <View style={styles.topbar}>{props.children}</View>
        </View>
      </storesContext.Provider>
    </View>
  );
});

export default TopbarTabbar;

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
  },
  topbar: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    padding: 8,
  },
});

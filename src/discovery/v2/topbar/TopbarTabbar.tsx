import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import { CommonStyle } from '../../../styles/Common';
import colors from '../../../styles/Colors';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import DiscoveryV2Store from '../DiscoveryV2Store';
import { useStores } from '../../../common/hooks/use-stores';
import { useDiscoveryV2Store } from '../DiscoveryV2Context';

interface Props {}

/**
 * Newsfeed top bar
 */
export const TopbarTabbar = observer(() => {
  const store = useDiscoveryV2Store();

  /**
   * Selected
   * @param {string} txt
   */
  const selected = (txt) => {
    const activeTabId = store.activeTabId;
    return activeTabId == txt ? styles.tabSelected : null;
  };

  /**
   * Render
   */

  return (
    <View>
      <View
        style={[
          styles.container,
          ThemedStyles.style.borderBottomHair,
          ThemedStyles.style.borderPrimary,
          ThemedStyles.style.backgroundSecondary,
        ]}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomColor: ThemedStyles.getColor(
                  'secondary_background',
                ),
              },
              selected('foryou'),
            ]}
            onPress={() => store.setTabId('foryou')}>
            <Text style={CommonStyle.fontM}>Just for you</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                borderBottomColor: ThemedStyles.getColor(
                  'secondary_background',
                ),
              },
              selected('tags'),
            ]}
            onPress={() => store.setTabId('tags')}>
            <Text style={CommonStyle.fontM}>Discovery by Tags</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    height: 42,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 6,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#EEE',
  },
  topbar: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
  },
  button: {
    padding: 8,
  },
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

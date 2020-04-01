//@ts-nocheck
import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Newsfeed top bar
 */
@inject('boost')
@observer
class BoostTabBar extends Component {
  selected(txt) {
    const filter = this.props.boost.filter;
    return filter === txt ? styles.tabSelected : null;
  }

  render() {
    return (
      <View style={[styles.container, ThemedStyles.style.backgroundSecondary]}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={[styles.tab, this.selected('peer')]}
            onPress={() => this.props.boost.setFilter('peer')}>
            <Text style={CommonStyle.fontS}>{i18n.t('boosts.tabOffers')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, this.selected('newsfeed')]}
            onPress={() => this.props.boost.setFilter('newsfeed')}>
            <Text style={CommonStyle.fontS}>
              {i18n.t('boosts.tabNewsfeed')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, this.selected('content')]}
            onPress={() => this.props.boost.setFilter('content')}>
            <Text style={CommonStyle.fontS}>{i18n.t('boosts.tabSidebar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default BoostTabBar;

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    padding: 8,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  },
});

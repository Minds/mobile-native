import React, {
  Component
} from 'react';

import {
  inject,
  observer
} from "mobx-react";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import i18n from '../../common/services/i18n.service';

/**
 * Newsfeed top bar
 */
@inject('newsfeed')
@observer
export default class Topbar extends Component {

  /**
   * Selected
   * @param {string} txt
   */
  selected(txt) {
    const filter = this.props.newsfeed.filter;
    return filter == txt ? styles.tabSelected : null;
  }

  /**
   * Render
   */
  render() {
    return (
      <View>
        <View style={[styles.container, CommonStyle.shadow]}>
          <View style={styles.topbar}>
            <TouchableOpacity style={[styles.tab, this.selected('subscribed')]} onPress={() => this.props.newsfeed.setFilter('subscribed')}>
              <Text style={CommonStyle.fontXS}>{i18n.t('newsfeed.subscribed')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, this.selected('boostfeed')]} onPress={() => this.props.newsfeed.setFilter('boostfeed')}>
              <Text style={CommonStyle.fontXS}>{i18n.t('newsfeed.boostfeed')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
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
  }
});
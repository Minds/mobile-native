import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';

import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import type NewsfeedStore from '../NewsfeedStore';

type PropsType = {
  newsfeed: NewsfeedStore<any>;
};

/**
 * Newsfeed top bar
 */
@inject('newsfeed')
@observer
export default class Topbar extends Component<PropsType> {
  /**
   * Selected
   * @param {string} txt
   */
  selected(txt) {
    const filter = this.props.newsfeed.filter;
    return filter === txt ? styles.tabSelected : null;
  }

  /**
   * Render
   */
  render() {
    return (
      <View>
        <View
          style={[
            styles.container,
            CommonStyle.shadow,
            ThemedStyles.style.backgroundSecondary,
          ]}>
          <View style={styles.topbar}>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  borderBottomColor: ThemedStyles.getColor(
                    'primary_background',
                  ),
                },
                this.selected('subscribed'),
              ]}
              onPress={() => this.props.newsfeed.setFilter('subscribed')}>
              <Text style={[CommonStyle.fontM, styles.label]}>
                {i18n.t('newsfeed.subscribed')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  borderBottomColor: ThemedStyles.getColor(
                    'primary_background',
                  ),
                },
                this.selected('boostfeed'),
              ]}
              onPress={() => this.props.newsfeed.setFilter('boostfeed')}>
              <Text style={[CommonStyle.fontM, styles.label]}>
                {i18n.t('newsfeed.boostfeed')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    //height: 30,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  topbar: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  button: {
    padding: 8,
  },
  tab: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    marginRight: 10,
    paddingVertical: 5,
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 15,
  },
});

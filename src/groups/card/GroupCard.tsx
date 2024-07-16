//@ts-nocheck
import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import SmartImage from '../../common/components/SmartImage';

import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import i18n from '../../common/services/i18n.service';

import MText from '../../common/components/MText';
import { Image } from 'expo-image';

/**
 * Group Card
 */
export default class GroupCard extends Component {
  /**
   * Get Group Banner
   */
  getBannerFromGroup() {
    const group = this.props.entity;
    return {
      uri:
        MINDS_CDN_URI +
        'fs/v1/banners/' +
        group.guid +
        '/fat/' +
        group.icontime,
    };
  }

  /**
   * Get Group Avatar
   */
  getAvatar() {
    const group = this.props.entity;
    return { uri: `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large` };
  }

  /**
   * Render
   */
  render() {
    const group = this.props.entity;
    const avatar = this.getAvatar();
    const iurl = this.getBannerFromGroup();
    const theme = sp.styles.style;

    return (
      <View>
        <SmartImage source={iurl} style={styles.banner} contentFit="cover" />
        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <View style={[theme.columnAlignCenter, theme.flexContainer]}>
              <MText style={styles.countertitle}>
                {i18n.t('members').toUpperCase()}
              </MText>
              <MText style={styles.countervalue}>
                {abbrev(group['members:count'], 1)}
              </MText>
            </View>
            <View style={[theme.columnAlignCenter, theme.flexContainer]}>
              <MText style={styles.countertitle}>
                {i18n.t('feed').toUpperCase()}
              </MText>
              <MText style={styles.countervalue}>
                {abbrev(group['activity:count'], 1)}
              </MText>
            </View>
            <View style={[theme.columnAlignCenter, theme.flexContainer]}>
              <MText style={styles.countertitle}>
                {i18n.t('comments.comments').toUpperCase()}
              </MText>
              <MText style={styles.countervalue}>
                {abbrev(group['comments:count'], 1)}
              </MText>
            </View>
          </View>
          <View style={[theme.rowJustifyCenter]}>
            <View style={styles.namecol}>
              <MText style={styles.name}>{group.name.toUpperCase()}</MText>
            </View>
          </View>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  countertitle: {
    color: '#666',
    fontSize: 10,
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  namecol: {
    flex: 1,
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 150,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row',
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 100,
    height: 100,
    width: 100,
    borderRadius: 55,
  },
});

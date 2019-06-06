import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  StyleSheet,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import FastImage from 'react-native-fast-image';
import { CommonStyle } from '../../styles/Common';
import i18n from '../../common/services/i18n.service';

/**
 * Group Card
 */
export default class GroupCard extends Component {

  /**
   * Get Group Banner
   */
  getBannerFromGroup() {
    const group = this.props.entity;
    return {uri: MINDS_CDN_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime};
  }

  /**
   * Get Group Avatar
   */
  getAvatar() {
    const group = this.props.entity;
    return {uri: `${MINDS_CDN_URI}fs/v1/avatars/${group.guid}/large`};
  }

  /**
   * Render
   */
  render() {

    const group = this.props.entity;
    const avatar = this.getAvatar();
    const iurl = this.getBannerFromGroup();

    return (
      <View>
        <FastImage source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>{i18n.t('members').toUpperCase()}</Text>
              <Text style={styles.countervalue}>{abbrev(group['members:count'], 0)}</Text>
            </View>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>{i18n.t('feed').toUpperCase()}</Text>
              <Text style={styles.countervalue}>{abbrev(group['activity:count'], 0)}</Text>
            </View>
            <View style={[CommonStyle.columnAlignCenter, CommonStyle.flexContainer]}>
              <Text style={styles.countertitle}>{i18n.t('comments.comments').toUpperCase()}</Text>
              <Text style={styles.countervalue}>{abbrev(group['comments:count'], 0)}</Text>
            </View>
          </View>
          <View style={[CommonStyle.rowJustifyCenter]}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{group.name.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <Image source={avatar} style={styles.avatar} />
      </View>
    )
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
    fontSize: 10
  },
  countervalue: {
    paddingTop: 5,
    fontWeight: 'bold',
  },
  namecol: {
    flex: 1,
    justifyContent: 'center'
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
    textAlign: 'center'
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row'
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 100,
    height: 100,
    width: 100,
    borderRadius: 55
  }
});

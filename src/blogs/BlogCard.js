import React, {
  PureComponent
} from 'react';

import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Button,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  Avatar,
} from 'react-native-elements';

import { MINDS_CDN_URI, MINDS_LINK_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import formatDate from '../common/helpers/date';

/**
 * Blog Card
 */
export default class BlogCard extends PureComponent {

  /**
   * Navigate to blog
   */
  navToBlog = () => {
    if (Platform.OS == 'ios') {
      return this.props.navigation.navigate('BlogView', { blog: this.props.entity });
    }
    Linking.openURL(MINDS_LINK_URI + 'blog/view/' + this.props.entity.guid);
  }

  /**
   * Render Card
   */
  render() {
    const blog = this.props.entity;
    const channel = this.props.entity.ownerObj;
    const image = blog.getBannerSource();

    return (
      <TouchableOpacity onPress={this.navToBlog} style={styles.container}>
        <FastImage source={image} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.bodyContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.titlecol}>
              <Text style={styles.title}>{blog.title}</Text>
              <View style={styles.ownerContainer}>
                { channel && <Avatar
                  width={24}
                  height={24}
                  rounded
                  source={channel.getAvatarSource()}
                /> }
                <Text style={styles.username}>{blog.ownerObj && blog.ownerObj.username.toUpperCase()}</Text>
                <Text style={styles.createdDate}>{formatDate(blog.time_created)}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  bodyContainer: {
    padding: 12,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  titlecol: {
    flex:1
  },
  titleContainer: {
    flexDirection: 'row',
    flex:1,
  },
  title: {
    fontWeight: '800',
    fontFamily: 'Roboto',
    color: '#444',
    letterSpacing: 0.5,
    fontSize: 16,
  },
  ownerContainer: {
    flex:1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 150,
  },
  headercontainer: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
  },
  username: {
    paddingLeft: 8,
    fontSize: 10,
    color: '#888'
  },
  createdDate: {
    paddingLeft: 5,
    fontSize: 8,
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row'
  },
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 10
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF'
  }
});

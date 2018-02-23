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
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  Avatar,
} from 'react-native-elements';

import { MINDS_CDN_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import formatDate from '../common/helpers/date';
import api from '../common/services/api.service';
/**
 * Blog Card
 */
export default class BlogCard extends PureComponent {

  /**
   * Navigate to blog
   */
  navToBlog = () => {
    this.props.navigation.navigate('BlogView', { blog: this.props.entity });
  }

  /**
   * Render Card
   */
  render() {
    const blog = this.props.entity;
    const channel = this.props.entity.ownerObj;
    const image = { uri: blog.thumbnail_src, headers: api.buildHeaders() };

    return (
      <TouchableOpacity onPress={this.navToBlog} >
        <FastImage source={image} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.headertextcontainer}>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{blog.title}</Text>
              <View style={styles.ownerContainer}>
                <Avatar
                  width={35}
                  height={35}
                  rounded
                  source={channel.getAvatarSource()}
                />
                <Text style={styles.username}>{blog.ownerObj.username.toUpperCase()}</Text>
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
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  namecol: {
    flex:1
  },
  namecontainer: {
    flexDirection: 'row',
    flex:1,
  },
  ownerContainer: {
    flex:1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding:3 ,
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
    paddingLeft: 5,
    fontSize: 10,
    color: '#999'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
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

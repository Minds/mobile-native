import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  Button,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_CDN_URI } from '../config/Config';
import FastImage from 'react-native-fast-image';
import formatDate from '../common/helpers/date';

/**
 * Blog Card
 */
@observer
export default class BlogCard extends Component {

  /**
   * Get Blog Avatar
   */
  getAvatar() {
    const channel = this.props.entity.ownerObj;
    return { uri: MINDS_CDN_URI + 'icon/' + channel.guid + '/small/' + channel.icontime };
  }

  /**
   * Render Card
   */
  render() {
    const blog = this.props.entity;

    const image = { uri: blog.thumbnail_src };

    return (
      <View>
        <FastImage source={image} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
        <View style={styles.headertextcontainer}>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              <Text style={styles.name}>{blog.title}</Text>
              <View style={styles.ownerContainer}>
                <Image source={this.getAvatar()} style={styles.avatar} />
                <Text style={styles.username}>{blog.ownerObj.username.toUpperCase()}</Text>
                <Text style={styles.createdDate}>{formatDate(blog.time_created)}</Text>
              </View>
            </View>
          </View>
        </View>
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

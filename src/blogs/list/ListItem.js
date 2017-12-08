import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
} from 'react-native';

import {
  Avatar,
  Tile
} from 'react-native-elements';

import { MINDS_URI } from '../../config/Config';
import formatDate from '../../common/helpers/date'

/**
 * Blogs List Item
 */

export default class ListItem extends PureComponent {
  render() {
    const blog = this.props.blog;
    const styles = this.props.styles;

    return (
      <Tile
        imageSrc={{ uri: blog.thumbnail_src }}
        title={blog.title}
        titleStyle={styles.title}
        contentContainerStyle={{ height: 120 }}
      >
        <View style={styles.titleContainer}>
          <View style={styles.avatarContainer}>
            <Avatar
              width={35}
              height={35}
              rounded
              source={{ uri: MINDS_URI + 'icon/' + blog.ownerObj.guid + '/medium' }}
            />
            <Text style={styles.text}>{blog.ownerObj.name}</Text>
          </View>
          <Text style={styles.text}>{formatDate(blog.time_created)}</Text>
        </View>
      </Tile>
    );
  }
}
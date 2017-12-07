import React, {
  Component
} from 'react';

import {
  Image,
  Text,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';

import { MINDS_URI } from '../config/Config';
import { Avatar, Tile } from 'react-native-elements';
import blogsService from './BlogsService';


/**
 * Blogs List screen
 */
export default class BlogsListScreen extends Component {

  state = {
    blogs: []
  }

  componentWillMount() {
    blogsService.loadList('featured', '')
      .then(data => {
        this.setState({
          blogs: data.blogs
        });
      });
  }

  //TODO: move to common
  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }

  renderRow = (row) => {
    const blog = row.item;
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
          <Text style={styles.text}>{this.formatDate(blog.time_created)}</Text>
        </View>
      </Tile>
    );
  }

  render() {
    return (
      <FlatList
        data={this.state.blogs}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        style={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 10 ,
    color: '#888',
    fontSize:  12
  },
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: '#FFF'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize:15,
    color: 'black'
  }
});
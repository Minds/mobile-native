import React, {
  Component
} from 'react';

import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import BlogCard from './BlogCard';
/**
 * Blogs List screen
 */
@inject('blogs')
@observer
export default class BlogsListScreen extends Component {

  /**
   * Load data on mount
   */
  componentWillMount() {
    this.props.blogs.loadList();
  }

  renderRow = (row) => {
    const blog = row.item;
    return (
      <View style={styles.cardContainer}>
        <BlogCard entity={blog} navigation={this.props.navigation} />
      </View>
    );
  }

  loadMore = () => {
    this.props.blogs.loadList();
  }

  render() {
    if (!this.props.blogs.loaded) {
      return (
        <View style={styles.activitycontainer}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    return (
      <FlatList
        data={this.props.blogs.entities.slice()}
        removeClippedSubviews
        onRefresh={this.refresh}
        refreshing={this.props.blogs.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0.09}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        style={styles.list}
        getItemLayout={(data, index) => (
          { length: 300, offset: 308 * index, index }
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: '#FFF'
  },
  cardContainer: {
    backgroundColor: '#ececec',
    paddingBottom: 8,
  }
});
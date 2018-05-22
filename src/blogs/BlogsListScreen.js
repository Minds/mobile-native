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
import Toolbar from '../common/components/toolbar/Toolbar';
import CenteredLoading from '../common/components/CenteredLoading';

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

  /**
   * Render Tabs
   */
  renderToolbar() {
    selectedTextStyle={color: 'black'};
    const typeOptions = [
      { text: 'TOP', value: 'trending', selectedTextStyle},
      { text: 'SUBSCRIPTIONS', value: 'network', selectedTextStyle},
      { text: 'MY GROUPS', value: 'owner', selectedTextStyle},
    ]
    return (
      <Toolbar
        options={ typeOptions }
        initial={ this.props.blogs.filter }
        onChange={ this.onTabChange }
      />
    )
  }

  onTabChange = (value) => {
    this.props.blogs.setFilter(value);
    this.props.blogs.refresh();
  }

  refresh = () => {
    this.props.blogs.refresh();
  }

  render() {
    const store = this.props.blogs;
    if (!store.list.loaded && !store.list.refreshing) {
      return (
        <CenteredLoading />
      );
    }


    return (
      <FlatList
        data={store.list.entities.slice()}
        removeClippedSubviews
        onRefresh={this.refresh}
        refreshing={store.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0.09}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        style={styles.list}
        ListHeaderComponent={this.renderToolbar()}
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
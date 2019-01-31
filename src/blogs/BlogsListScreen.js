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
import TagsSubBar from '../newsfeed/topbar/TagsSubBar';
import { CommonStyle } from '../styles/Common';
import { MINDS_CDN_URI, MINDS_FEATURES } from '../config/Config';

const selectedTextStyle = {color: 'black'};
const typeOptions = [
  (MINDS_FEATURES.suggested_blogs_screen ? { text: 'TOP', value: 'suggested', selectedTextStyle} : { text: 'TRENDING', value: 'trending', selectedTextStyle}),
  { text: 'SUBSCRIPTIONS', value: 'network', selectedTextStyle},
  { text: 'MY BLOGS', value: 'owner', selectedTextStyle},
]

/**
 * Blogs List screen
 */
@inject('blogs')
@observer
export default class BlogsListScreen extends Component {

  static navigationOptions = {
    title: 'Blogs',
  };

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
   * On tag selection change
   */
  onTagSelectionChange = () => {
    this.props.blogs.refresh();
  }

  /**
   * Render Tabs
   */
  renderToolbar() {

    return (
      <View>
        <Toolbar
          options={ typeOptions }
          initial={ this.props.blogs.filter }
          onChange={ this.onTabChange }
        />
        { this.props.blogs.filter == 'suggested' && <View style={[CommonStyle.paddingTop, CommonStyle.paddingBottom, CommonStyle.hairLineBottom]}>
          <TagsSubBar onChange={this.onTagSelectionChange}/>
        </View>}
      </View>
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
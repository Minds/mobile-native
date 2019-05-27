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
import TagsSubBar from '../newsfeed/topbar/TagsSubBar';
import { CommonStyle as CS } from '../styles/Common';
import { MINDS_CDN_URI, MINDS_FEATURES } from '../config/Config';
import ErrorLoading from '../common/components/ErrorLoading';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import i18n from '../common/services/i18n.service';

const selectedTextStyle = {color: 'black'};
const typeOptions = [
  { text: i18n.t('blogs.tabSubscriptions'), value: 'network', selectedTextStyle},
  { text: i18n.t('blogs.tabMyBlogs'), value: 'owner', selectedTextStyle},
];

const BlogCardWithErrorBoundary = withErrorBoundary(BlogCard);

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
        <BlogCardWithErrorBoundary entity={blog} navigation={this.props.navigation} />
      </View>
    );
  }

  /**
   * Load data
   */
  loadMore = () => {
    if (this.props.blogs.list.errorLoading) return;
    this.props.blogs.loadList();
  }

  /**
   * Load more forced
   */
  loadMoreForce = () => {
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
        { this.props.blogs.filter == 'suggested' && <View style={[CS.paddingTop, CS.paddingBottom, CS.hairLineBottom]}>
          <TagsSubBar onChange={this.onTagSelectionChange}/>
        </View>}
      </View>
    )
  }

  /**
   * On tab change
   */
  onTabChange = (value) => {
    this.props.blogs.setFilter(value);
    this.props.blogs.reload();
  }

  /**
   * Refresh
   */
  refresh = () => {
    this.props.blogs.refresh();
  }

  /**
   * Render
   */
  render() {
    const store = this.props.blogs;

    const footer = this.getFooter()

    return (
      <FlatList
        data={store.list.entities.slice()}
        removeClippedSubviews
        onRefresh={this.refresh}
        refreshing={store.list.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0.09}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        style={styles.list}
        ListHeaderComponent={this.renderToolbar()}
        ListFooterComponent={footer}
        getItemLayout={(data, index) => (
          { length: 300, offset: 308 * index, index }
        )}
      />
    );
  }

  /**
   * Get list's footer
   */
  getFooter() {
    if (this.props.blogs.loading && !this.props.blogs.list.refreshing){
      return (
        <View style={[CS.centered, CS.padding3x]}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    if (!this.props.blogs.list.errorLoading) return null;

    const message = this.props.blogs.list.entities.length ?
      i18n.t('cantLoadMore') :
      i18n.t('cantLoad');

    return <ErrorLoading message={message} tryAgain={this.loadMoreForce}/>
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
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

import ListItem from './list/ListItem';

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
      <ListItem blog={blog} styles={styles} navigation={this.props.navigation} />
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
          { length: 300, offset: 300 * index, index }
        )}
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
  listitem: {
    minHeight:300,
    paddingTop:10,
    paddingBottom:10,
  },
  titleContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize:15,
    color: 'black'
  },
  image: {
    height: 200
  },
  activitycontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
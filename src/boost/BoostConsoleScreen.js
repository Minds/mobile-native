import React, { Component } from 'react';
import { 
  FlatList,
  StyleSheet,
  View,
  TouchableHighlight,
  Text 
} from 'react-native';
import { observer, inject } from 'mobx-react/native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Boost from './Boost';

import CenteredLoading from '../common/components/CenteredLoading';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import BoostTabBar from './BoostTabBar';

/**
 * News feed list component
 */
@inject('boost')
@observer
export default class BoostConsoleScreen extends Component {

  state = {
    screen: 'gallery'
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this.props.boost.loadList(this.props.guid);
  }

 
  createPost() {
    this.props.navigation.navigate('Capture');
  }
  /**
   * Render component
   */
  render() {
    let empty;

    if (this.props.boost.loading) {
      empty = (<CenteredLoading/>);
    }

    if (this.props.boost.list.loaded && !this.props.boost.list.refreshing) {
      empty = (
        <View style={ComponentsStyle.emptyComponentContainer}>
          <View style={ComponentsStyle.emptyComponent}>
            <Icon name="trending-up" size={72} color='#444' />
            <Text style={ComponentsStyle.emptyComponentMessage}>You don't have any boosts</Text>
            <Text 
              style={ComponentsStyle.emptyComponentLink}
              onPress={() => this.props.navigation.navigate('Capture')}
              >
              Create a post
            </Text>
          </View>
        </View>);
    }

    const tabs = (<BoostTabBar />);

    return <FlatList
              ListHeaderComponent={tabs}
              ListEmptyComponent={empty}
              data={this.props.boost.list.entities.slice()}
              renderItem={this.renderBoost}
              keyExtractor={item => item.rowKey}
              onRefresh={this.refresh}
              refreshing={this.props.boost.list.refreshing}
              onEndReached={this.loadFeed}
              onEndThreshold={0}
              style={styles.listView}
            />
  }

  /**
   * Load boosts data
   */
  loadFeed = () => {
    this.props.boost.loadList(this.props.guid);
  }

  /**
   * Refresh feed data
   */
  refresh = () => {
    this.props.boost.refresh(this.props.guid)
  }

  /**
   * Render row
   */
  renderBoost = (row) => {
    const boost = row.item;
    return (
      <View>
        <Boost boost={boost} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  buttons: {
    alignItems: 'center',
  },
  selectedButton: {
    alignItems: 'center',
    borderBottomWidth:3,
    borderColor: 'yellow'
  },
  buttonBar: {
    height:35 
  }
});
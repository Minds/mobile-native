import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native'

import Boost from './Boost';

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
   * Render component
   */
  render() {
    return (
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <FlatList
            ListHeaderComponent={this.props.header}
            data={this.props.boost.list.entities.slice()}
            renderItem={this.renderBoost}
            keyExtractor={item => item.guid}
            onRefresh={this.refresh}
            refreshing={this.props.boost.list.refreshing}
            onEndReached={this.loadFeed}
            onEndThreshold={0}
            style={styles.listView}
          />
        </View>
        {
          this.props.boost.filter === 'peer' ? 
            <View style={{height:35}}>
              <View style={{flex:1, flexDirection:'row'}}>
                <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setPeerFilter('inbox')} style={this.props.boost.peer_filter === 'inbox'? styles.selectedButton: styles.buttons}>
                  <Text>Inbox</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setPeerFilter('outbox')} style={this.props.boost.peer_filter === 'outbox'? styles.selectedButton: styles.buttons}>
                  <Text>Outbox</Text>
                </TouchableHighlight>
              </View>
            </View> : null
        }
        <View style={{height:35}}>
          <View style={{flex:1, flexDirection:'row'}}>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('newsfeed')} style={this.props.boost.filter === 'newsfeed'? styles.selectedButton: styles.buttons}>
              <Text>Newsfeed</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('content')} style={this.props.boost.filter === 'content'? styles.selectedButton: styles.buttons}>
              <Text>Sidebars</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('peer')} style={this.props.boost.filter === 'peer'? styles.selectedButton: styles.buttons}>
              <Text>Channels</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
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
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  selectedButton: {
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderBottomWidth:3,
    borderColor: 'yellow'
  }
});
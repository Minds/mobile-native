import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableHighlight, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native'

import Boost from './Boost';

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

/**
 * News feed list component
 */
@inject('boost')
@observer
export default class BoostConsoleScreen extends Component {

  state = {
    screen: 'gallery'
  }

  showList() {
    if(this.props.boost.list.entities.length > 0) {
      return <FlatList
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
    } else {
      return <View style={[CommonStyle.flexContainer, CommonStyle.alignJustifyCenter]}>
                <Text style={{fontWeight: 'bold', fontSize:16}}>You have no boosted posts</Text>
                <TouchableHighlight
                  onPress={() => { this.createPost()}} 
                  underlayColor = 'transparent'
                  style = {ComponentsStyle.bluebutton}
                >
                  <Text style={{color: colors.primary}} > Create </Text>
                </TouchableHighlight>
              </View>
    }
  }

  createPost() {
    this.props.navigation.navigate('Capture');
  }
  /**
   * Render component
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        {this.showList()}
        {
          this.props.boost.filter === 'peer' ? 
            <View style={styles.buttonBar}>
              <View style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]}>
                <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setPeerFilter('inbox')} style={this.props.boost.peer_filter === 'inbox'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
                  <Text>Inbox</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setPeerFilter('outbox')} style={this.props.boost.peer_filter === 'outbox'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
                  <Text>Outbox</Text>
                </TouchableHighlight>
              </View>
            </View> : null
        }
        <View style={styles.buttonBar}>
          <View style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]}>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('newsfeed')} style={this.props.boost.filter === 'newsfeed'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
              <Text>Newsfeed</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('content')} style={this.props.boost.filter === 'content'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
              <Text>Sidebars</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' onPress={() => this.props.boost.setFilter('peer')} style={this.props.boost.filter === 'peer'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
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
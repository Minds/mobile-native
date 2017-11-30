import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { observer, inject } from 'mobx-react/native'
import Icon from 'react-native-vector-icons/Ionicons';

import { getFeed } from './NewsfeedService';

import Activity from './activity/Activity';


@inject('newsfeed')
@observer
export default class NewsfeedScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.newsfeed.entities}
        renderItem={this.renderActivity}
        keyExtractor={item => item.guid}
        onRefresh={() => this.props.newsfeed.refresh()}
        refreshing={this.props.newsfeed.refreshing}
        onEndReached={() => this.props.newsfeed.loadFeed()}
        onEndThreshold={0.3}
        style={styles.listView}
      />
    );
  }

  // Should be unessesary with MobX because the component is a observer and only is rerendered again on state change
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps == this.props && nextState == this.state)
  //     return false;
  //   return true;
  // }

  renderActivity=(row) => {
    const entity = row.item;
    return (
      <View>
        <Activity entity={entity} navigation={this.props.navigation}/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
	listView: {
    //paddingTop: 20,
    backgroundColor: '#FFF',
    flex: 1,
  }
});
import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import Activity from './activity/Activity';

export default class ActivityScreen extends Component {
  render() {
    const entity = this.props.navigation.state.params.entity;
    return (
      <View style={styles.screen}>
        <Activity
          entity={ entity }
          newsfeed={ this.props.newsfeed }
          navigation={ this.props.navigation }
        />
      </View>
    )
  }
}

const styles = {
  screen: {
    flex:1,
    backgroundColor: '#FFF'
  }
}
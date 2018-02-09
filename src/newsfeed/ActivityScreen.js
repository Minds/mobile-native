import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';

import Activity from './activity/Activity';

export default class ActivityScreen extends Component {

  render() {
    const entity = this.props.navigation.state.params.entity;
    return (
      <ScrollView style={styles.screen}>
        <Activity
          entity={ entity }
          newsfeed={ this.props.navigation.state.params.store }
          navigation={ this.props.navigation }
          autoHeight={true}
        />
      </ScrollView>
    )
  }
}

const styles = {
  screen: {
    flex:1,
    backgroundColor: '#FFF'
  }
}
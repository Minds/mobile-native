import React, { Component } from 'react';
import {
  ScrollView,
} from 'react-native';

import CenteredLoading from '../common/components/CenteredLoading'
import Activity from './activity/Activity';
import ActivityModel from './ActivityModel';
import { getSingle } from './NewsfeedService';

export default class ActivityScreen extends Component {

  state = {
    entity: null
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    const params = this.props.navigation.state.params;

    if (params.entity) {
      this.setState({entity: params.entity});
    } else {
      getSingle(params.guid)
        .then(resp => {
          this.setState({ entity: ActivityModel.create(resp.activity)});
        });
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.setState({entity: null});
  }

  /**
   * Render
   */
  render() {
    const entity = this.state.entity;

    if (!entity) {
      return <CenteredLoading/>
    }

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
import React, {
  Component
} from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import ThumbUpAction from './actions/ThumbUpAction';
import ThumbDownAction from './actions/ThumbDownAction';
import WireAction from './actions/WireAction';
import CommentsAction from './actions/CommentsAction';
import RemindAction from './actions/RemindAction';

import { CommonStyle } from '../../styles/Common';

@inject('user')
@observer
export default class Actions extends Component {

  /**
   * Render
   */
  render() {
    return (
      <View style={CommonStyle.flexContainer}>
        <View style={styles.container}>
          <ThumbUpAction entity={this.props.entity} me={this.props.user.me}/>
          <ThumbDownAction entity={this.props.entity} me={this.props.user.me}/>
          <WireAction entity={this.props.entity} navigation={this.props.navigation}/>
          <CommentsAction entity={this.props.entity} navigation={this.props.navigation}/>
          <RemindAction entity={this.props.entity}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});

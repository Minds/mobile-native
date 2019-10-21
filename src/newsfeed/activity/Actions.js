import React, {
  PureComponent
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
import BoostAction from './actions/BoostAction';

import { CommonStyle } from '../../styles/Common';
import featuresService from '../../common/services/features.service';

@inject('user')
export default class Actions extends PureComponent {

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const isOwner = this.props.user.me.guid === entity.owner_guid;

    return (
      <View style={CommonStyle.flexContainer}>
        { entity && <View style={styles.container}>
          <ThumbUpAction entity={entity} me={this.props.user.me}/>
          <ThumbDownAction entity={entity} me={this.props.user.me}/>
          {!isOwner && featuresService.has('crypto') && <WireAction owner={entity.ownerObj} navigation={this.props.navigation}/>}
          <CommentsAction entity={entity} navigation={this.props.navigation}/>
          <RemindAction entity={entity} navigation={this.props.navigation} activityIndex={this.props.activityIndex}/>
          {isOwner && featuresService.has('crypto') && <BoostAction entity={entity} navigation={this.props.navigation}/>}
        </View> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingTop: featuresService.has('crypto') ? 4 : 8,
    paddingBottom:  featuresService.has('crypto') ? 4 : 8,
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});

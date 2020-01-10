import React, {Component} from 'react';

import {Text, View} from 'react-native';

import {CommonStyle as CS} from '../../styles/Common';
import i18n from '../services/i18n.service';
import {TouchableOpacity} from 'react-native-gesture-handler';

/**
 * Blocked Channel
 */
export default class BlockedChannel extends Component {
  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.ownerObj.guid,
      });
    }
  };

  /**
   * Render
   */
  render() {
    return (
      <View
        style={[
          CS.flexContainer,
          CS.centered,
          CS.padding2x,
          CS.backgroundLight,
          CS.fullWidth,
        ]}>
        <Text style={[CS.fontXL, CS.colorDarkGreyed, CS.marginTop3x]}>
          {i18n.to('channel.blockedNav', null, {
            username: (
              <Text style={CS.bold} onPress={this.navToChannel}>
                @{this.props.entity.ownerObj.username}
              </Text>
            ),
          })}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await this.props.entity.unblockOwner();
          }}>
          <Text
            style={[
              CS.fontL,
              CS.colorPrimary,
              CS.marginTop3x,
              CS.marginBottom3x,
            ]}>
            {i18n.t('undo')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


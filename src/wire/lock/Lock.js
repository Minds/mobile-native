import React, {
  PureComponent
} from 'react';

import {
  Text,
  View
} from 'react-native';

import { Icon } from 'react-native-elements'
import FastImage from 'react-native-fast-image';

import { CommonStyle } from '../../styles/Common';
import currency from '../../common/helpers/currency';
import Button from '../../common/components/Button';

import {
  MINDS_URI,
  MINDS_CDN_URI
} from '../../config/Config';


/**
 * Wire lock component
 */
export default class Lock extends PureComponent {

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    if (entity.isOwner()) {
      return (
        <View style={[CommonStyle.padding2x, CommonStyle.alignJustifyCenter]}>
          <Text style={CommonStyle.fontS}>{this.getOwnerIntro()}</Text>
          <View style={[CommonStyle.rowJustifyCenter, CommonStyle.alignJustifyCenter]}>
            <Icon
              reverse
              name='ios-flash'
              type='ionicon'
              size={8}
              iconStyle={{ fontSize: 22 }}
              color='#4caf50'
            />
            <Text style={[CommonStyle.fontM, { color: '#4caf50' }]}>Locked</Text>
          </View>
        </View>
      )
    }

    const intro = this.getIntro();

    const imageUri = { uri: this.getBackground()};

    return (
      <View>
        <View style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.alignJustifyCenter]}>
          <Text>{intro}</Text>
          <Button text='UNLOCK' color='#4caf50' containerStyle={CommonStyle.rowJustifyCenter} onPress={this.unlock}>
            <Icon
              name='ios-flash'
              type='ionicon'
              size={22}
              color='#4caf50'
            />
          </Button>
        </View>
        <FastImage
          source={imageUri}
          style={{height: 200, width: '100%'}}
        />
        <View style={[CommonStyle.alignJustifyCenter, CommonStyle.padding2x, style.mask]}>
          <Icon
            name='ios-flash'
            type='ionicon'
            size={55}
            color='white'
          />
          <Text style={[CommonStyle.colorWhite, CommonStyle.fontXXXL, CommonStyle.paddingBottom2x]}>{this.getFormatedAmount()}/month</Text>
          <Text style={[CommonStyle.colorWhite, CommonStyle.fontS, CommonStyle.textCenter]}>THIS POST CAN ONLY BE SEEN BY SUPPORTERS WHO WIRE {this.getFormatedAmount().toUpperCase()}/MONTH TO @{entity.ownerObj.name.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  /**
   * Unlock
   */
  unlock = () => {
    this.props.navigation.navigate('WireFab', {
      owner: this.props.entity.ownerObj,
      default: this.props.entity.wire_threshold,
      onComplete: () => {
        this.props.entity.unlock();
      }
    });
  }

  /**
   * Get lock background image uri
   */
  getBackground() {
    const entity = this.props.entity;

    if (entity._preview) {
      return entity.ownerObj.merchant.exclusive._backgroundPreview;
    }

    let background = entity.get('ownerObj.merchant.exclusive.background');

    if (!background) {
      return MINDS_URI + '/assets/photos/andromeda-galaxy.jpg';
    }

    return MINDS_CDN_URI + 'fs/v1/paywall/preview/' + entity.ownerObj.guid + '/' + background;
  }

  /**
   * Get intro for owners
   */
  getOwnerIntro() {
    const entity = this.props.entity;
    return 'Only supporters who wire you over ' + this.getFormatedAmount() + '/month will see this post.';
  }

  /**
   * Get intro
   */
  getIntro() {
    const entity = this.props.entity;

    let intro = entity.get('ownerObj.merchant.exclusive.intro');
    if (intro) return intro;

    intro = 'Wire me over ' + this.getFormatedAmount() + '/month to see this post.';
    return intro;
  }

  /**
   * Get the formated amount
   */
  getFormatedAmount() {
    const entity = this.props.entity;
    return currency(entity.wire_threshold.min, entity.wire_threshold.type, 'suffix');
  }
}

const style = {
  mask: {
    position: 'absolute',
    bottom: 0,
    height: 200,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
}
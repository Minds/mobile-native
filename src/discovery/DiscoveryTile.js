import React, {
  Component
} from 'react';

import {
  Platform,
  Text,
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import FastImage from 'react-native-fast-image';

import {
  MINDS_CDN_URI
} from '../config/Config';

import {
  observer
} from 'mobx-react/native'
import Placeholder from 'rn-placeholder';

import ExplicitImage from '../common/components/explicit/ExplicitImage';
import ExplicitOverlay from '../common/components/explicit/ExplicitOverlay';
import { CommonStyle as CS } from '../styles/Common';
import i18n from '../common/services/i18n.service';

const isAndroid = Platform.OS === 'android';

@observer
export default class DiscoveryTile extends Component {

  state = {
    error: false,
    style: null
  }

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.size !== nextProps.size) {
      return {
        style: { width: nextProps.size, height: nextProps.size }
      }
    }

    return null;
  }

  /**
   * Navigate to view
   */
  _navToView = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Activity', {
        entity: this.props.entity,
        scrollToBottom: false
      });
    }
    if (this.props.onPress) this.props.onPress();
  }

  errorRender = (err) => {
    return (
      <View style={CS.centered}>
        <Text styles={[CS.colorWhite, CS.fontS, CS.textCenter]}>{i18n.t('discovery.imageError')}</Text>
      </View>
    )
  }

  setError = (err) => {
    this.setState({error: true});
  }

  setActive = () => {
    this.setState({ready: true});
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  }

  /**
   * Render
   */
  render() {
    if (this.state.error) return this.errorRender();

    const entity = this.props.entity;

    if (!entity.is_visible){
      return null;
    }

    const url = entity.getThumbSource();

    // load gif with lower priority
    if (entity.isGif()) {
      url.priority = FastImage.priority.low;
    }

    const show_overlay = (entity.shouldBeBlured() && !entity.is_parent_mature) && !(entity.shouldBeBlured() && entity.is_parent_mature);

    const overlay = (show_overlay) ?
      <ExplicitOverlay
        entity={entity}
        iconSize={45}
        hideText={true}
      /> :
      null;

    return (
      <TouchableOpacity onPress={this._navToView} style={[ this.state.style, styles.tile ]}>
        <View style={ [CS.flexContainer, CS.backgroundGreyed] }>
          <FastImage
            source={ url }
            style={ CS.positionAbsolute }
            onLoadEnd={this.setActive}
            onError={this.setError}
          />
          {overlay}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tile: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 1,
    paddingLeft: 1,
  }
});

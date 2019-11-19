import React, {Component} from 'react';

import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';

import {observer} from 'mobx-react/native';

import ExplicitOverlay from '../common/components/explicit/ExplicitOverlay';
import {CommonStyle as CS} from '../styles/Common';
import i18n from '../common/services/i18n.service';

export default
@observer
class DiscoveryTile extends Component {
  state = {
    error: false,
    style: null,
  };

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.size !== nextProps.size) {
      return {
        style: {width: nextProps.size, height: nextProps.size},
      };
    }

    return null;
  }

  /**
   * On press
   */
  _onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.entity);
    }
  };

  errorRender = () => {
    return (
      <View style={CS.centered}>
        <Text styles={[CS.colorWhite, CS.fontS, CS.textCenter]}>
          {i18n.t('discovery.imageError')}
        </Text>
      </View>
    );
  };

  errorRenderVideo = () => {
    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[this.state.style, styles.tile]}>
        <View style={[CS.flexContainer, CS.backgroundBlack]} />
      </TouchableOpacity>
    );
  };

  setError = () => {
    this.setState({error: true});
  };

  setActive = () => {
    this.setState({ready: true});
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  };

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;

    if (this.state.error) {
      return entity.custom_type && entity.custom_type === 'video'
        ? this.errorRenderVideo()
        : this.errorRender();
    }

    if (!entity.is_visible) {
      return null;
    }

    const url = entity.getThumbSource();

    // load gif with lower priority
    if (entity.isGif()) {
      url.priority = FastImage.priority.low;
    }

    const show_overlay =
      entity.shouldBeBlured() &&
      !entity.is_parent_mature &&
      !(entity.shouldBeBlured() && entity.is_parent_mature);

    const overlay = show_overlay ? (
      <ExplicitOverlay entity={entity} iconSize={45} hideText={true} />
    ) : null;

    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={[this.state.style, styles.tile]}>
        <View style={[CS.flexContainer, CS.backgroundGreyed]}>
          <FastImage
            source={url}
            style={CS.positionAbsolute}
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
  },
});

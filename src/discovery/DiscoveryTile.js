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
import { isEntityNsfw } from '../common/helpers/isNsfw';

const isAndroid = Platform.OS === 'android';

@observer
export default class DiscoveryTile extends Component {

  state = {
    error: false
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
    return <Text styles={[CS.colorWhite, CS.fontS, CS.textCenter]}>Error loading media</Text>
  }

  setError = (err) => {
    this.setState({error: true});
  }

  setActive = () => {
    this.setState({ready: true});
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  }

  render() {
    if (this.state.error) return this.errorRender();

    const entity = this.props.entity;

    const url = entity.getThumbSource();

    const style = { width: this.props.size, height: this.props.size };

    const show_overlay = (isEntityNsfw(entity) && !entity.is_parent_mature) && !(isEntityNsfw(entity) && entity.is_parent_mature);

    const overlay = (show_overlay) ?
      <ExplicitOverlay
        entity={entity}
        iconSize={45}
        hideText={true}
      /> :
      null;

    return (
      <TouchableOpacity onPress={this._navToView} style={[ style, styles.tile ]}>
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

import React, {
  Component
} from 'react';

import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import FastImage from 'react-native-fast-image';

import { BlurView, VibrancyView } from 'react-native-blur';

export default class ExplicitImage extends Component {

  render() {
    const entity = this.props.entity.ownerObj;
    return (
      <View style={styles.container}>
        { !this.props.entity.mature ?
          <FastImage source={ this.props.source } style={this.props.styles} resizeMode={FastImage.resizeMode.cover}/>:
          <BlurView
            source={ this.props.source }
            style={this.props.styles}
            blurAmount={20}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
});
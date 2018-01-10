import React, {
  Component
} from 'react';

import {observer} from "mobx-react";

import {
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  findNodeHandle,
  View
} from 'react-native';

import FastImage from 'react-native-fast-image';

import { BlurView, VibrancyView } from 'react-native-blur';
import { Icon } from 'react-native-elements';

@observer
export default class ExplicitImage extends Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  imageLoaded() {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <FastImage source={ this.props.source } onLoadEnd={this.imageLoaded.bind(this)} ref={(img) => { this.backgroundImage = img; }} style={styles.absolute}/>
        { (this.props.entity.mature && this.state.viewRef) ?
          <BlurView
            style={styles.absolute}
            viewRef={this.state.viewRef}
            blurType="light"
            blurAmount={20}
          /> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    backgroundColor: 'black',
    top: 0, left: 0, bottom: 0, right: 0,
  },
});
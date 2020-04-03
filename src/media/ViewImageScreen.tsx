//@ts-nocheck
import React, {
  Component,
} from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

// import PhotoView from 'react-native-photo-view';

import { CommonStyle } from '../styles/Common';
import testID from '../common/helpers/testID';
import ImageViewer from '../common/components/ImageViewer';

/**
 * Full screen image viewer
 */
export default class ViewImageScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    transitionConfig: {
      isModal: true
    }
  });

  constructor(props) {
    super(props);

    const custom_data = this.props.route.params.entity.custom_data;

    const width = Dimensions.get('window').width;

    let height = 300;

    if (custom_data && custom_data[0].height && custom_data[0].height != '0') {
      let ratio = custom_data[0].height / custom_data[0].width;
      height = width * ratio;
    }

    this.state = {
      width,
      height,
    };
  }

  getSource() {
    return this.props.route.params.source;
  }

  render() {

    const source = this.getSource();

    return (
      <View style={[CommonStyle.flexContainerCenter, CommonStyle.alignCenter, CommonStyle.backgroundBlack]}>
        <ImageViewer
          source={source}
          width={this.state.width}
          height={this.state.height}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#000',
    paddingTop: Platform.OS == 'ios' ? 14 : 8,
  },
  iconclose: {
    alignSelf: 'flex-end',
    padding: Platform.OS == 'ios' ? 10 : 8,
    color: '#FFF',
  },
});
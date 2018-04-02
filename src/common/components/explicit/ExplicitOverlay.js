import React, {
  Component
} from 'react';

import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { observer } from 'mobx-react/native';
import { BlurView } from 'react-native-blur';
import { CommonStyle } from '../../../styles/Common';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Explicit overlay
 */
@observer
export default class ExplicitOverlay extends Component {

  /**
   * toggle overlay
   */
  toogle = () => {
    this.props.entity.toggleMatureVisibility();
  }

  /**
   * Render
   */
  render() {
    if (this.props.entity.mature_visibility) {
      return (
        <TouchableOpacity style={[CommonStyle.positionAbsoluteTopRight]} onPress={this.toogle}>
          <Icon name="explicit" size={30} color={'red'} style={CommonStyle.shadow}/>
        </TouchableOpacity>
      )
    }

    return [
      <BlurView
        style={CommonStyle.positionAbsolute}
        viewRef={this.props.viewRef}
        blurType="light"
        key={0}
        blurAmount={20}
      />,
      <TouchableOpacity style={[CommonStyle.positionAbsolute, CommonStyle.centered]} onPress={this.toogle} key={1}>
        <Icon name="explicit" size={80} color={'white'} style={CommonStyle.shadow}/>
        <Text style={[CommonStyle.colorWhite, CommonStyle.shadow]}>Confirm you are 18+</Text>
      </TouchableOpacity>
    ]
  }
}
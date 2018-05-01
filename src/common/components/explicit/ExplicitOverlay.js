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
   * Default props
   */
  static defaultProps = {
    iconSize: 80,
    hideText: false
  };

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
    const {
      iconSize,
      hideText,
    } = this.props;

    if (this.props.entity.mature_visibility) {
      return (
        <TouchableOpacity style={[CommonStyle.positionAbsoluteTopRight]} onPress={this.toogle}>
          <Icon name="explicit" size={iconSize/2.5} color={'red'} style={CommonStyle.shadow}/>
        </TouchableOpacity>
      )
    }

    let blur = null;

    if (this.props.viewRef) {
      blur =  <BlurView
        style={CommonStyle.positionAbsolute}
        viewRef={this.props.viewRef}
        blurType="light"
        key={0}
        blurAmount={20}
      />
    }

    return [
      blur,
      <TouchableOpacity style={[CommonStyle.positionAbsolute, CommonStyle.centered]} onPress={this.toogle} key={1}>
        <Icon name="explicit" size={iconSize} color={'white'} style={CommonStyle.shadow}/>
        {!hideText && <Text style={[CommonStyle.colorWhite, CommonStyle.shadow]}>Confirm you are 18+</Text>}
      </TouchableOpacity>
    ]
  }
}
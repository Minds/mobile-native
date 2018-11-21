import React, {
  Component
} from 'react';

import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { observer } from 'mobx-react/native';
import { CommonStyle as CS } from '../../../styles/Common';
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
        <View style={[CS.positionAbsoluteTopRight, CS.paddingRight4x, CS.marginRight4x]}>
          <Icon name="explicit" size={iconSize/2.5} color={'red'} style={CS.shadow} onPress={this.toogle}/>
        </View>
      )
    }

    return (
      <TouchableOpacity activeOpacity={1} style={[CS.positionAbsolute, CS.centered, CS.backgroundDarkGreyed]} onPress={this.toogle}>
        <Icon name="explicit" size={iconSize} color={'white'} style={CS.shadow}/>
        {!hideText && <Text style={[CS.colorWhite, CS.shadow]}>Confirm you are 18+</Text>}
      </TouchableOpacity>
    )
  }
}
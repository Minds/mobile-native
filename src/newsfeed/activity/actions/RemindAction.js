import React, {
  PureComponent
} from 'react';

import {
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS} from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';
import { FLAG_REMIND } from '../../../common/Permissions';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Remind Action Component
 */
export default class RemindAction extends PureComponent {

  static defaultProps = {
    size: 20,
  };

  /**
   * Render
   */
  render() {
    const canRemind = this.props.entity.can(FLAG_REMIND);

    const color = canRemind ? (this.props.entity['reminds'] > 0 ? CS.colorPrimary : CS.colorAction) : CS.colorLightGreyed;

    return (
      <TouchableOpacityCustom
        style={[CS.flexContainer, CS.centered, this.props.vertical === true ? CS.columnAlignCenter : CS.rowJustifyCenter]}
        onPress={this.remind}
        {...testID('Remind activity button')}
      >
        <Icon style={[color, CS.marginRight]} name='repeat' size={this.props.size} />
        <Counter count={this.props.entity['reminds']} size={this.props.size * 0.70} />
      </TouchableOpacityCustom>
    )
  }

  /**
   * Open remind
   */
  remind = () => {
    // check permission and show alert
    if (!this.props.entity.can(FLAG_REMIND, true)) return;

    const { state } = this.props.navigation
    this.props.navigation.push('Capture', {isRemind: true, entity: this.props.entity, parentKey: state.key, activityIndex: this.props.activityIndex});
  }
}





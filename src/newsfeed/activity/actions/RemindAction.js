import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native';

import IonIcon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
import { CommonStyle } from '../../../styles/Common';
import Counter from './Counter';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import testID from '../../../common/helpers/testID';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Remind Action Component
 */
export default class RemindAction extends PureComponent {

  static defaultProps = {
    size: 20,
  };

  state = {
    remindModalVisible: false,
  }

  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacityCustom style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter, this.props.vertical === true ? styles.verticalTouchable : null]} onPress={this.remind} {...testID('Remind activity button')}>
        <Icon color={this.props.entity['reminds'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='repeat' size={this.props.size} />
        <Counter count={this.props.entity['reminds']} size={this.props.size * 0.75} />
      </TouchableOpacityCustom>
    )
  }

  /**
   * Open remind
   */
  remind = () => {
    const { state } = this.props.navigation
    this.props.navigation.push('Capture', {isRemind: true, entity: this.props.entity, parentKey: state.key});
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingTop: 4,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  },
  verticalTouchable: {
    flexDirection: 'column',
    alignItems: 'center',
  }
});





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
import Remind from '../remind/Remind';
import { CommonStyle } from '../../../styles/Common';

/**
 * Remind Action Component
 */
export default class RemindAction extends PureComponent {

  state = {
    remindModalVisible: false,
  }

  /**
   * Render
   */
  render() {
    return (
      <TouchableOpacity style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]} onPress={this.remind}>
        <Icon color={this.props.entity['reminds'] > 0 ? 'rgb(70, 144, 214)' : 'rgb(96, 125, 139)'} name='repeat' size={20} />
        <Text style={CommonStyle.paddingLeft}>{this.props.entity['reminds'] > 0 ? this.props.entity['reminds'] : ''}</Text>
        <View style={styles.modalContainer}>
          <Modal animationType={"slide"} transparent={false}
            visible={this.state.remindModalVisible}
            onRequestClose={this.closeRemind}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <IonIcon onPress={this.closeRemind} color='gray' size={30} name='md-close' />
              </View>
              <Remind entity={this.props.entity} />
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    )
  }

  /**
   * Close remind modal
   */
  closeRemind = () => {
    this.setState({ remindModalVisible: false });
  }

  /**
   * Open remind modal
   */
  remind = () => {
    this.setState({ remindModalVisible: true });
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
  }
});





import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/Colors';
import Touchable from '../common/components/Touchable';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements'
import TransparentButton from '../common/components/TransparentButton';
import LicensePicker from '../common/components/LicensePiker';

@inject('capture')
@observer
export default class CapturePosterFlags extends Component {
  state = {
    shareModalVisible: false,
    lockingModalVisible: false,

    lock: false,
    min: '0',
  };

  // Lifecycle

  componentWillMount() {
    this.props.capture.loadThirdPartySocialNetworkStatus();
  }

  componentWillReceiveProps(props) {
    if (typeof props.lockValue !== 'undefined') {
      this.updateLockFromProps(props.lockValue);
    }
  }

  // Share

  showShareModal = () => {
    this.setState({ shareModalVisible: true });
  }

  dismissShareModal = () => {
    this.setState({ shareModalVisible: false });
  }

  isSharing() {
    if (!this.props.shareValue) {
      return false;
    }

    for (let network in this.props.shareValue) {
      if (this.props.shareValue[network])
        return true;
    }

    return false;
  }

  shareModalPartial() {
    const networks = [
      { key: 'facebook', icon: 'logo-facebook', color: '#3b5998', label: 'Facebook' },
      { key: 'twitter', icon: 'logo-twitter', color: '#1da1f2', label: 'Twitter' },
    ].map(i => {
      const available = this.props.capture.socialNetworks[i.key],
        onShare = () => available && this.props.onShare(i.key);

      let logoColor = this.props.shareValue[i.key] ? i.color : Colors.darkGreyed;

      if (!available) {
        logoColor = Colors.greyed;
      }

      return (
        <Touchable
          key={i.key}
          style={styles.shareModalItem}
          onPress={onShare}
          disabled={!available}
        >
          <IonIcon
            name={i.icon}
            color={logoColor}
            size={25}
          />

          <Text
            style={[
              styles.shareModalItemText,
              this.props.shareValue[i.key] && styles.shareModalItemTextActive
            ]}
          >{i.label.toUpperCase()}</Text>

          {available && <IonIcon
            style={styles.shareModalItemCheck}
            name={this.props.shareValue[i.key] ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'}
            color={this.props.shareValue[i.key] ? Colors.primary : Colors.darkGreyed}
            size={25}
          />}
        </Touchable>
      );
    });

    return (
      <Modal
        isVisible={this.state.shareModalVisible}
        backdropOpacity={0.35}
        avoidKeyboard={true}
        animationInTiming={150}
        onBackButtonPress={this.dismissShareModal}
        onBackdropPress={this.dismissShareModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>SHARE</Text>

            <IonIcon
              style={styles.modalCloseIcon}
              size={28}
              name="ios-close"
              onPress={this.dismissShareModal}
            />
          </View>

          {networks}
        </View>
      </Modal>
    );
  }

  // Locking (Wire Threshold)

  showLockingModal = () => {
    this.setState({ lockingModalVisible: true });
  }

  setLock = () => {
    const success = this.emitLockChanges();
    this.dismissLockingModal();

    return success;
  }

  dismissLockingModal = () => {
    this.setState({ lockingModalVisible: false });
  }

  isLocking() {
    return parseInt(this.state.min) > 0;
  }

  setMin = min => {
    if (min.indexOf('0') === 0) {
      min = min.replace(/^0+/, '');
    }

    if (min === '') {
      min = '0';
    }

    this.setState({ min });
  };

  toggleLock = () => {
    const lock = !this.state.lock;
    this.setState({ lock });
  }

  canSetLock() {
    return !this.state.lock || (
      this.state.lock &&
      this.state.min &&
      parseFloat(this.state.min) > 0
    );
  }

  emitLockChanges() {
    let lockValue = null;

    if (this.state.min && parseFloat(this.state.min) > 0) {
      lockValue = {
        type: 'tokens',
        min: parseFloat(this.state.min)
      }
    }

    this.props.onLocking(lockValue);

    return true;
  }

  updateLockFromProps(lockValue) {
    if (lockValue === null) {
      this.setState({ lock: false, min: '0' });
    } else {
      this.setState({ lock: true, min: `${lockValue.min}` });
    }
  }

  lockingModalPartial() {
    return (
      <Modal
        isVisible={this.state.lockingModalVisible}
        backdropOpacity={0.35}
        avoidKeyboard={true}
        animationInTiming={150}
        onBackButtonPress={this.dismissLockingModal}
        onBackdropPress={this.dismissLockingModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>LOCK BY WIRE</Text>

            <IonIcon
              style={styles.modalCloseIcon}
              size={28}
              name="ios-close"
              onPress={this.dismissLockingModal}
            />
          </View>

          <View>

            <View style={styles.lockModalInputView}>
              <TextInput
                style={styles.lockModalInputTextInput}
                keyboardType="numeric"
                value={this.state.min}
                onChangeText={this.setMin}
              />

              <Text
                style={styles.lockModalInputLabel}
              >
                TOKENS
              </Text>
            </View>

            <View style={styles.lockModalSubmitView}>
              <TransparentButton
                color={colors.primary}
                onPress={this.setLock}
                title="Done"
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Main

  render() {
    const attachment = this.props.capture.attachment;
    return (
      <View style={styles.view}>
        <View style={{ flex: 1}} />
        {attachment.hasAttachment && <View style={styles.cell}>
          <LicensePicker 
            onLicenseSelected={(v) => attachment.setLicense(v)} 
            value={attachment.license} 
            iconColor={attachment.license ? Colors.primary : Colors.darkGreyed}
          />
        </View>}
        <Touchable style={styles.cell} onPress={this.props.onMature}>
          <MdIcon
            name="explicit"
            color={this.props.matureValue ? Colors.explicit : Colors.darkGreyed}
            size={25}
          />

          {this.props.matureValue && <Text style={styles.matureLabel}>
            MATURE
          </Text>}
        </Touchable>

        <Touchable style={styles.cell} onPress={this.showShareModal}>
          <MdIcon
            name="share"
            color={this.isSharing() ? Colors.primary : Colors.darkGreyed}
            size={25}
          />
        </Touchable>

        <Touchable style={[styles.cell, styles.cell__last]} onPress={this.showLockingModal}>
          <IonIcon
            name="ios-flash"
            color={this.isLocking() ? Colors.primary : Colors.darkGreyed}
            size={30}
          />
        </Touchable>
        {this.shareModalPartial()}
        {this.lockingModalPartial()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 5,
    //borderWidth: 1,
    //borderColor: '#ececec',
    //marginLeft: 2,
    marginRight: 8,
  },
  cell: {
    // padding provided by IonIcon{ios-flash} cell
    //flexGrow: 1,
    //flexBasis: '33.333%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    //borderRightWidth: 1,
    //borderColor: '#ececec',
  },
  cell__last: {
    borderRightWidth: 0,
  },
  matureLabel: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: Colors.explicit,
    fontSize: 12,
    marginLeft: 3,
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  shareModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  shareModalItemText: {
    flexGrow: 1,
    fontSize: 13,
    fontFamily: 'Roboto',
    marginLeft: 6,
    letterSpacing: 1,
    color: Colors.darkGreyed,
  },
  shareModalItemTextActive: {
    color: Colors.dark,
  },
  shareModalItemCheck: {
    alignSelf: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    flexGrow: 1,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginLeft: 10,
  },
  modalCloseIcon: {
    padding: 5,
    marginRight: 10,
    alignSelf: 'flex-end',
  },
  lockModalCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  lockModalCheckText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 6,
  },
  lockModalInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
  },
  lockModalInputTextInput: {
    flexGrow: 1,
    fontSize: 16,
    fontWeight: '300',
    padding: 5,
    marginRight: 3,
    backgroundColor: '#eee',
    borderRadius: 3,
    color: '#666',
    textAlign: 'right',
  },
  lockModalInputLabel: {
    fontFamily: 'Roboto',
    fontWeight: '300',
    fontSize: 14,
    color: '#666',
    letterSpacing: 1,
  },
  lockModalSubmitView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

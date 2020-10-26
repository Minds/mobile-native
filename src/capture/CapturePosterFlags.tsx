//@ts-nocheck
import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../styles/Colors';
import Touchable from '../common/components/Touchable';
import Modal from 'react-native-modal';
import LicensePicker from '../common/components/LicensePicker';
import TagInput from '../common/components/TagInput';
import TagSelect from '../common/components/TagSelect';
import featuresService from '../common/services/features.service';
import NsfwToggle from '../common/components/nsfw/NsfwToggle';
import logService from '../common/services/log.service';
import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';
import DateTimePicker from 'react-native-modal-datetime-picker';
import BaseModel from '../common/BaseModel';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';

@inject('capture')
@observer
class CapturePosterFlags extends Component {
  state = {
    shareModalVisible: false,
    hashsModalVisible: false,
    suggestedHashsModalVisible: false,
    lockingModalVisible: false,
    lock: false,
    min: '0',
    datePickerVisible: false,
  };

  // Lifecycle

  componentWillMount() {
    // this.props.capture.loadThirdPartySocialNetworkStatus();
    this.props.capture.loadSuggestedTags().catch((e) => {
      logService.exception('[CapturePosterFlags] loadSuggestedTags', e);
    });

    if (typeof this.props.lockValue !== 'undefined') {
      this.updateLockFromProps(this.props.lockValue);
    }
  }

  // Share

  showShareModal = () => {
    this.setState({ shareModalVisible: true });
  };

  dismissShareModal = () => {
    this.setState({ shareModalVisible: false });
  };

  // Hash
  showHashsModal = () => {
    this.setState({ hashsModalVisible: true });
  };

  dismissHashsModal = () => {
    this.setState({
      hashsModalVisible: false,
      suggestedHashsModalVisible: false,
    });
  };

  // Suggested Hash
  toogleSuggestedHashs = () => {
    this.setState({
      suggestedHashsModalVisible: !this.state.suggestedHashsModalVisible,
    });
  };

  isSharing() {
    if (!this.props.shareValue) {
      return false;
    }

    for (let network in this.props.shareValue) {
      if (this.props.shareValue[network]) return true;
    }

    return false;
  }

  hashsModal() {
    const theme = ThemedStyles.style;
    if (this.props.hideHash) {
      return null;
    }
    return (
      <Modal
        isVisible={this.state.hashsModalVisible}
        backdropOpacity={0.35}
        avoidKeyboard={true}
        animationInTiming={150}
        onBackButtonPress={this.dismissHashsModal}
        onBackdropPress={this.dismissHashsModal}>
        <View style={[styles.modalView, theme.backgroundTertiary]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>HASHTAGS</Text>
            <Text
              style={[
                styles.modalTitle,
                styles.modalTitleButton,
                this.state.suggestedHashsModalVisible
                  ? [theme.colorIconActive, theme.borderIconActive]
                  : null,
              ]}
              onPress={this.toogleSuggestedHashs}>
              SUGGESTED
            </Text>

            <IonIcon
              style={theme.colorIcon}
              size={35}
              name="ios-close"
              onPress={this.dismissHashsModal}
            />
          </View>

          {this.state.suggestedHashsModalVisible ? (
            <TagSelect
              onTagDeleted={this.props.capture.deleteTag}
              onTagAdded={this.props.capture.addTag}
              tags={this.props.capture.selectedSuggested}
            />
          ) : (
            <TagInput
              tags={this.props.capture.allTags}
              onTagDeleted={this.props.capture.deleteTag}
              onTagAdded={this.props.capture.addTag}
              max={5}
            />
          )}
        </View>
      </Modal>
    );
  }

  shareModalPartial() {
    const theme = ThemedStyles.style;

    if (this.props.hideShare) return null;

    const networks = [
      {
        key: 'facebook',
        icon: 'logo-facebook',
        color: '#3b5998',
        label: 'Facebook',
      },
      {
        key: 'twitter',
        icon: 'logo-twitter',
        color: '#1da1f2',
        label: 'Twitter',
      },
    ].map((i) => {
      const available = this.props.capture.socialNetworks[i.key],
        onShare = () => available && this.props.onShare(i.key);

      let logoColor = this.props.shareValue[i.key] ? i.color : theme.colorIcon;

      if (!available) {
        logoColor = Colors.greyed;
      }

      return (
        <Touchable
          key={i.key}
          style={styles.shareModalItem}
          onPress={onShare}
          disabled={!available}>
          <IonIcon name={i.icon} color={logoColor} size={25} />

          <Text
            style={[
              styles.shareModalItemText,
              this.props.shareValue[i.key] && styles.shareModalItemTextActive,
            ]}>
            {i.label.toUpperCase()}
          </Text>

          {available && (
            <IonIcon
              style={styles.shareModalItemCheck}
              name={
                this.props.shareValue[i.key]
                  ? 'ios-checkmark-circle-outline'
                  : 'ios-radio-button-off-outline'
              }
              color={
                this.props.shareValue[i.key]
                  ? theme.colorIconActive
                  : theme.colorIcon
              }
              size={25}
            />
          )}
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
        onBackdropPress={this.dismissShareModal}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{i18n.t('capture.share')}</Text>

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

  showDatePicker = () => {
    this.setState({ datePickerVisible: true });
  };

  dismissDatePicker = () => {
    this.setState({ datePickerVisible: false });
  };

  shouldRenderScheduler = () => {
    const hasFeature = featuresService.has('post-scheduler');
    const timeCreatedValue = this.props.timeCreatedValue;
    return (
      hasFeature &&
      (!timeCreatedValue || BaseModel.isScheduled(timeCreatedValue))
    );
  };

  // Locking (Wire Threshold)

  showLockingModal = () => {
    this.setState({ lockingModalVisible: true });
  };

  setLock = () => {
    const success = this.emitLockChanges();
    this.dismissLockingModal();

    return success;
  };

  dismissLockingModal = () => {
    this.setState({ lockingModalVisible: false });
  };

  isLocking() {
    return parseFloat(this.state.min) > 0;
  }

  setMin = (min) => {
    if (min === '') {
      min = '0';
    } else {
      const number = parseFloat(min);
      if (number && min.slice(-1) !== '.') {
        min = Math.round(number * 1000) / 1000;
        min = min.toString();
      }
    }

    this.setState({ min });
  };

  toggleLock = () => {
    const lock = !this.state.lock;
    this.setState({ lock });
  };

  canSetLock() {
    return (
      !this.state.lock ||
      (this.state.lock && this.state.min && parseFloat(this.state.min) > 0)
    );
  }

  emitLockChanges() {
    let lockValue = null;

    if (this.state.min && parseFloat(this.state.min) > 0) {
      lockValue = {
        type: 'tokens',
        min: parseFloat(this.state.min),
      };
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

  schedulerDatePicker() {
    return (
      <DateTimePicker
        isVisible={this.state.datePickerVisible}
        onConfirm={this.onScheduled}
        date={this.props.timeCreatedValue || new Date()}
        onCancel={this.dismissDatePicker}
        mode="datetime"
      />
    );
  }

  onScheduled = (time_created) => {
    this.props.onScheduled(time_created);
    this.dismissDatePicker();
  };

  lockingModalPartial() {
    const theme = ThemedStyles.style;
    if (this.props.hideLock) return null;
    return (
      <Modal
        isVisible={this.state.lockingModalVisible}
        backdropOpacity={0.35}
        avoidKeyboard={true}
        animationInTiming={150}
        onBackButtonPress={this.dismissLockingModal}
        onBackdropPress={this.dismissLockingModal}>
        <View style={[styles.modalView, theme.backgroundTertiary]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{i18n.t('capture.lock')}</Text>

            <IonIcon
              style={theme.colorIcon}
              size={28}
              name="ios-close"
              onPress={this.dismissLockingModal}
            />
          </View>

          <View>
            <View style={styles.lockModalInputView}>
              <TextInput
                style={[
                  styles.lockModalInputTextInput,
                  theme.borderIcon,
                  theme.colorPrimaryText,
                ]}
                keyboardType="numeric"
                value={this.state.min}
                onChangeText={this.setMin}
                {...testID('Poster lock amount input')}
              />

              <Text style={styles.lockModalInputLabel}>
                {i18n.t('capture.tokens')}
              </Text>
            </View>

            <View style={styles.lockModalSubmitView}>
              <Button
                onPress={this.setLock}
                text={i18n.t('done')}
                {...testID('Poster lock done button')}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderNsfw() {
    //if (GOOGLE_PLAY_STORE || Platform.OS === 'ios') return null;
    return (
      <NsfwToggle
        containerStyle={styles.cell}
        labelStyle={styles.matureLabel}
        value={this.props.nsfwValue}
        onChange={this.props.onNsfw}
      />
    );
  }

  /**
   * Render
   */
  render() {
    const attachment = this.props.capture.attachment;

    const theme = ThemedStyles.style;

    return (
      <View style={[styles.view, this.props.containerStyle]}>
        {attachment.hasAttachment && (
          <View style={styles.cell}>
            <LicensePicker
              onLicenseSelected={(v) => attachment.setLicense(v)}
              value={attachment.license}
              iconColor={
                attachment.license ? theme.colorIconActive : theme.colorIcon
              }
            />
          </View>
        )}

        {this.renderNsfw()}

        {!this.props.hideShare && (
          <Touchable style={styles.cell} onPress={this.showShareModal}>
            <MdIcon
              name="share"
              style={this.isSharing() ? theme.colorIconActive : theme.colorIcon}
              size={25}
            />
          </Touchable>
        )}

        {!this.props.hideHash && (
          <Touchable style={styles.cell} onPress={this.showHashsModal}>
            <FaIcon
              name="hashtag"
              style={this.isSharing() ? theme.colorIconActive : theme.colorIcon}
              size={25}
            />
          </Touchable>
        )}

        {!this.props.hideLock && (
          <Touchable
            style={[styles.cell, styles.cell__last]}
            onPress={this.showLockingModal}>
            <IonIcon
              name="ios-flash"
              style={this.isLocking() ? theme.colorIconActive : theme.colorIcon}
              size={30}
              {...testID('Post lock button')}
            />
          </Touchable>
        )}

        {this.shouldRenderScheduler() && (
          <Touchable
            style={[styles.cell, styles.cell__last]}
            onPress={this.showDatePicker}>
            <IonIcon
              name="md-calendar"
              style={
                BaseModel.isScheduled(this.props.timeCreatedValue)
                  ? theme.colorIconActive
                  : theme.colorIcon
              }
              size={30}
              {...testID('Post scheduler button')}
            />
          </Touchable>
        )}
        {this.shareModalPartial()}
        {this.lockingModalPartial()}
        {this.hashsModal()}
        {this.schedulerDatePicker()}
      </View>
    );
  }
}

export default CapturePosterFlags;

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
    paddingLeft: 10,
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
  modalTitleButton: {
    flexGrow: 0,
    fontSize: 12,
    fontWeight: '400',
    borderRadius: 10,
    borderColor: Colors.greyed,
    textAlign: 'center',
    borderWidth: 1,
    padding: 5,
    marginRight: 10,
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
    borderRadius: 3,
    borderWidth: 1,
    textAlign: 'right',
  },
  lockModalInputLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    letterSpacing: 1,
  },
  lockModalSubmitView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

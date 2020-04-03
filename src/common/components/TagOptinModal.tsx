//@ts-nocheck
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import TagSelect from './TagSelect';
import TagInput from './TagInput';
import i18n from '../services/i18n.service';

/**
 * Tag Opt in Modal
 */
@inject('hashtag')
@observer
export default class TagOptinModal extends Component {

  state = {
    showModal: false
  };

  /**
   * Show modal
   */
  showModal = () => {
    this.setState({showModal: true});
  }

  /**
   * Hide modal
   */
  dismissModal = () => {
    this.setState({showModal: false});
  }

  /**
   * Render
   */
  render() {
    return (
      <Modal
        isVisible={this.state.showModal}
        backdropOpacity={0.35}
        avoidKeyboard={true}
        animationInTiming={150}
        onBackButtonPress={this.dismissModal}
        onBackdropPress={this.dismissModal}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{i18n.t('hashtags.title')}</Text>
            <IonIcon
              style={styles.modalCloseIcon}
              size={28}
              name="ios-close"
              onPress={this.dismissModal}
            />
          </View>
            <TagInput
             hideTags={true}
             tags={this.props.hashtag.suggested.map(m => m.value)}
             onTagDeleted={this.props.hashtag.deselect}
             onTagAdded={this.props.hashtag.create}
            />
            <TagSelect
              onTagDeleted={this.props.hashtag.deselect}
              onTagAdded={this.props.hashtag.select}
              tags={this.props.hashtag.suggested}
            />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
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
  }
});

import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import Switch from 'react-native-switch-pro'
import IonIcon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { debounce } from 'lodash';

import TagSelect from './TagSelect';
import TagInput from './TagInput';
import { CommonStyle as CS } from '../../styles/Common';

/**
 * Tag Opt in Drawer
 */
@inject('hashtag')
@observer
export default class TagOptinDrawer extends Component {

  /**
   * State
   */
  state = {
    showModal: false,
    top: 0
  };

  /**
   * Show modal
   */
  showModal = (top = 0) => {
    this.setState({showModal: true, top});
  }

  /**
   * Hide modal
   */
  dismissModal = () => {
    this.setState({showModal: false});
  }

  /**
   * Component did mount
   */
  componentDidMount() {
    this.props.hashtag.loadSuggested();
  }

  /**
   * Toggle tags filter
   */
  toogleAll = () => setTimeout(() => {
    this.props.hashtag.toggleAll();
    this.onChange();
  }, 300);

  /**
   * On select one tag
   */
  onSelectOne = (tag) => {
    this.props.hashtag.setHashtag(tag);
    this.props.onSelectOne && this.props.onSelectOne(tag);
  }

  /**
   * Debounce tag changes
   */
  debouncedOnChange = () => {
    this.props.onChange && this.props.onChange();
  }

  onChange = debounce(this.debouncedOnChange, 700, { leading: false, trailing: true });

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
        animationIn={'slideInLeft'}
        animationOut={'slideOutLeft'}
        onBackButtonPress={this.dismissModal}
        onBackdropPress={this.dismissModal}
        style={[styles.modal]}
        // onSwipeComplete={this.dismissModal}
        // swipeDirection="left"
        // propagateSwipe={true}
      >
        <View style={[styles.modalView]}>
          <ScrollView style={CS.flexContainer}>
            <View style={[CS.rowJustifySpaceEvenly, CS.alignCenter, CS.borderBottomHair, CS.paddingBottom2x, CS.borderGreyed]}>
              <Text>Preferred</Text>
              <Switch value={!this.props.hashtag.all} onSyncPress={this.toogleAll}></Switch>
            </View>
            <Text style={[CS.fontS, CS.colorDarkGreyed, CS.fontLight, CS.textCenter, CS.marginTop]}>Hold to select only one</Text>
            <TagSelect
              tagStyle={[CS.backgroundWhite, CS.padding1x, CS.flexContainer]}
              textSelectedStyle={[CS.fontSemibold, !this.props.hashtag.all ? CS.colorPrimary : CS.colorDarkGreyed]}
              textStyle={[CS.fontL, CS.colorDarkGreyed]}
              containerStyle={[CS.columnAlignStart]}
              onTagDeleted={this.props.hashtag.deselect}
              onTagAdded={this.props.hashtag.select}
              tags={this.props.hashtag.suggested}
              onChange={this.onChange}
              onSelectOne={this.onSelectOne}
            />
          </ScrollView>
          <View style={styles.inputContainer}>
            <TagInput
              noAutofocus={true}
              hideTags={true}
              tags={this.props.hashtag.suggested.map(m => m.value)}
              onTagDeleted={this.props.hashtag.deselect}
              onTagAdded={this.props.hashtag.create}
              onChange={this.onChange}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  inputContainer: {
    height: 40
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 10,
    width: '50%',
    flex:1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  modal : {
    margin:0,
    height: '100%',
    marginVertical: 40,
    justifyContent: 'flex-start',
    padding:0
  }
});

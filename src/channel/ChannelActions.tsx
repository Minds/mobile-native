//@ts-nocheck
import React, { Component } from 'react';

import { View, ActivityIndicator, Platform } from 'react-native';

import { observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../common/services/i18n.service';
import ActionSheet from 'react-native-actionsheet';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import Button from '../common/components/Button';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import { CommonStyle as CS } from '../styles/Common';
import {
  FLAG_SUBSCRIBE,
  FLAG_MESSAGE,
  FLAG_EDIT_CHANNEL,
  FLAG_WIRE,
} from '../common/Permissions';
import ChannelModeSelector from './ChannelModeSelector';
import ThemedStyles from '../styles/ThemedStyles';

const ButtonCustom = withPreventDoubleTap(Button);

/**
 * Channel Actions
 */
@observer
class ChannelActions extends Component {
  state = {};

  componentDidMount() {
    this.getScheduledCount();
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  handleSelection = (index) => {
    this.executeAction(index);
  };

  getOptions() {
    let options = [i18n.t('cancel')];

    if (this.props.store.channel.isSubscribed()) {
      options.push(i18n.t('channel.unsubscribe'));
    }

    if (!this.props.store.channel.blocked) {
      options.push(i18n.t('channel.block'));
    } else {
      options.push(i18n.t('channel.unblock'));
    }

    options.push(i18n.t('channel.report'));

    return options;
  }

  executeAction(option) {
    let options = this.getOptions();
    let selected = options[option];
    switch (selected) {
      case i18n.t('channel.unsubscribe'):
        this.props.store.channel.toggleSubscription();
        break;
      case i18n.t('channel.block'):
        this.props.store.channel.toggleBlock();
        break;
      case i18n.t('channel.unblock'):
        this.props.store.channel.toggleBlock();
        break;
      case i18n.t('channel.report'):
        this.props.navigation.push('Report', {
          entity: this.props.store.channel,
        });
        break;
    }
  }

  toggleSubscription = () => {
    this.props.store.channel.toggleSubscription();
  };

  /**
   * Navigate To conversation
   */
  navToConversation = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Conversation', {
        conversation: {
          guid: this.props.store.channel.guid + ':' + sessionService.guid,
        },
      });
    }
  };

  openWire = () => {
    this.props.navigation.navigate('WireFab', {
      owner: this.props.store.channel,
    });
  };

  onEditAction = () => {
    this.props.onEditAction();
  };

  onViewScheduledAction = async () => {
    this.props.onViewScheduledAction();
  };

  getScheduledCount = async () => {
    if (featuresService.has('post-scheduler')) {
      await this.props.store.feedStore.getScheduledCount();
    }
  };

  shouldRenderScheduledButton = () => {
    return featuresService.has('post-scheduler') && !this.state.edit;
  };

  setSheetRef = (o) => (this.ActionSheet = o);

  /**
   * Render Header
   */
  render() {
    const channel = this.props.store.channel;
    const isOwner = channel.isOwner();
    const showWire =
      !channel.blocked &&
      !isOwner &&
      featuresService.has('crypto') &&
      Platform.OS !== 'ios' &&
      channel.can(FLAG_WIRE);
    const showScheduled =
      featuresService.has('post-scheduler') && !this.state.edit && isOwner;
    const showSubscribe =
      !isOwner && !channel.isSubscribed() && channel.can(FLAG_SUBSCRIBE);
    const showMessage =
      !isOwner && channel.isSubscribed() && channel.can(FLAG_MESSAGE);
    const showEdit = isOwner && channel.can(FLAG_EDIT_CHANNEL);
    const showMode =
      isOwner && featuresService.has('permissions') && this.props.editing;

    if (this.props.store.isUploading) {
      return <ActivityIndicator size="small" />;
    }

    return (
      <View style={[CS.rowJustifyEnd, CS.marginTop2x]}>
        {showScheduled && (
          <ButtonCustom
            onPress={this.onViewScheduledAction}
            accessibilityLabel={i18n.t('channel.viewScheduled')}
            text={`${i18n.t('channel.viewScheduled')}: ${
              this.props.store.feedStore.feedStore.scheduledCount
            }`}
            loading={this.state.saving}
            inverted={
              this.props.store.feedStore.endpoint ==
              this.props.store.feedStore.scheduledEndpoint
                ? true
                : undefined
            }
          />
        )}
        {showSubscribe && (
          <ButtonCustom
            onPress={this.toggleSubscription}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft]}
            accessibilityLabel={i18n.t('channel.subscribeMessage')}
            text={i18n.t('channel.subscribe')}
            testID="SubscribeButton"
          />
        )}
        {showMessage && (
          <ButtonCustom
            onPress={this.navToConversation}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft]}
            accessibilityLabel={i18n.t('channel.sendMessage')}
            text={i18n.t('channel.message')}
            testID="SendMessageButton"
          />
        )}
        {showEdit && (
          <ButtonCustom
            onPress={this.onEditAction}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft]}
            accessibilityLabel={
              this.props.editing
                ? i18n.t('channel.saveChanges')
                : i18n.t('channel.editChannel')
            }
            text={this.props.editing ? i18n.t('save') : i18n.t('edit')}
            loading={this.props.saving}
            testID="EditButton"
          />
        )}
        {showMode && <ChannelModeSelector channel={channel} />}
        {showWire && (
          <ButtonCustom
            onPress={this.openWire}
            accessibilityLabel="Wire Button"
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft]}
            textStyle={[CS.marginLeft, CS.marginRight]}
            icon="ios-flash"
            text="Wire"
            testID="WireButton">
            <Icon
              name="ios-flash"
              size={16}
              style={[CS.marginLeft, ThemedStyles.style.colorPrimaryText]}
            />
          </ButtonCustom>
        )}
        {!isOwner && (
          <ButtonCustom
            onPress={this.showActionSheet}
            accessibilityLabel={i18n.t('more')}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft]}
            textStyle={[CS.marginLeft, CS.marginRight]}
            icon="ios-flash"
            text={i18n.t('more')}
            testID="MoreButton"
          />
        )}
        <ActionSheet
          ref={this.setSheetRef}
          title={i18n.t('actions')}
          options={this.getOptions()}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    );
  }
}

export default ChannelActions;

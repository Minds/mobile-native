import React, {
  Component
} from 'react';

import {
  View,
  ActivityIndicator
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '../common/services/i18n.service';
import ActionSheet from 'react-native-actionsheet';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import Button from '../common/components/Button';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import { CommonStyle as CS } from '../styles/Common';
import { FLAG_SUBSCRIBE, FLAG_MESSAGE, FLAG_EDIT_CHANNEL, FLAG_WIRE } from '../common/Permissions';

const ButtonCustom = withPreventDoubleTap(Button);

/**
 * Channel Actions
 */
export default
@observer
class ChannelActions extends Component {

  state = {
    scheduledCount: '',
  }

  componentDidMount() {
    this.getScheduledCount();
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  }

  handleSelection = (index) => {
    this.executeAction(index);
  }

  getOptions() {
    let options = [ i18n.t('cancel') ];

    if (this.props.store.channel.subscribed){
      options.push( i18n.t('channel.unsubscribe') );
    }

    if (!this.props.store.channel.blocked) {
      options.push( i18n.t('channel.block') );
    } else {
      options.push( i18n.t('channel.unblock') );
    }

    options.push( i18n.t('channel.report') );

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
        this.props.store.toggleBlock();
        break;
      case i18n.t('channel.unblock'):
        this.props.store.toggleBlock();
        break;
      case i18n.t('channel.report'):
        this.props.navigation.push('Report', { entity: this.props.store.channel });
        break;
    }
  }

  toggleSubscription = () => {
    this.props.store.channel.toggleSubscription();
  }

  /**
   * Navigate To conversation
   */
  navToConversation = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Conversation', { conversation: { guid : this.props.store.channel.guid + ':' + sessionService.guid } });
    }
  }

  openWire = () => {
    this.props.navigation.navigate('WireFab', { owner: this.props.store.channel});
  }

  onEditAction = () => {
    this.props.onEditAction();
  }

  onViewScheduledAction = async () => {
    this.props.onViewScheduledAction();
  }

  getScheduledCount = async () => {
    if (featuresService.has('post-scheduler')) {
      const count = await this.props.store.feedStore.getScheduledCount();
      this.setState({ scheduledCount: count });
    }
  }

  shouldRenderScheduledButton = () => {
    return featuresService.has('post-scheduler') && !this.state.edit;
  }

  /**
   * Render Header
   */
  render() {

    const channel = this.props.store.channel;
    const isOwner = channel.isOwner();
    const showWire = !channel.blocked && !isOwner && featuresService.has('crypto') && channel.can(FLAG_WIRE);
    const showScheduled = featuresService.has('post-scheduler') && !this.state.edit && isOwner;
    const showSubscribe = !isOwner && !channel.subscribed && channel.can(FLAG_SUBSCRIBE);
    const showMessage = !isOwner && channel.can(FLAG_MESSAGE);

    if (this.props.store.isUploading) {
      return (
        <ActivityIndicator size="small" />
      )
    }

    return (
      <View style={[CS.rowJustifyEnd, CS.marginTop2x]}>
        { showScheduled &&
          <ButtonCustom
            onPress={this.onViewScheduledAction}
            accessibilityLabel={i18n.t('channel.viewScheduled')}
            text={`${i18n.t('channel.viewScheduled')}: ${this.state.scheduledCount}`}
            loading={this.state.saving}
            inverted={this.props.store.feedStore.endpoint == this.props.store.feedStore.scheduledEndpoint ? true : undefined}
          />
        }
        { showSubscribe &&
          <ButtonCustom
            onPress={this.toggleSubscription}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
            accessibilityLabel={i18n.t('channel.subscribeMessage')}
            text={i18n.t('channel.subscribe')}
          />
        }
        { showMessage &&
          <ButtonCustom
            onPress={ this.navToConversation }
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
            accessibilityLabel={i18n.t('channel.sendMessage')}
            text={i18n.t('channel.message')}
          />
        }
        { channel.can(FLAG_EDIT_CHANNEL) &&
          <ButtonCustom
            onPress={this.onEditAction}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
            accessibilityLabel={this.props.editing ? i18n.t('channel.saveChanges') : i18n.t('channel.editChannel')}
            text={this.props.editing ? i18n.t('save') : i18n.t('edit')}
            loading={this.props.saving}
          />
        }
        { showWire &&
          <ButtonCustom
            onPress={ this.openWire }
            accessibilityLabel="Wire Button"
            containerStyle={[CS.rowJustifyCenter]}
            textStyle={[CS.marginLeft, CS.marginRight]}
            icon="ios-flash"
            text="Wire"
          >
            <Icon name='ios-flash' size={18} style={[CS.marginLeft, CS.colorPrimary]} />
          </ButtonCustom>
        }
        { !isOwner &&
          <ButtonCustom
            onPress={ this.showActionSheet }
            accessibilityLabel={i18n.t('more')}
            containerStyle={[CS.rowJustifyCenter]}
            textStyle={[CS.marginLeft, CS.marginRight]}
            icon="ios-flash"
            text={i18n.t('more')}
          />
        }
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={i18n.t('actions')}
          options={this.getOptions()}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    )
  }
}

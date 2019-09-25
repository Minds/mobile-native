import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import channelService from './ChannelService';
import i18n from '../common/services/i18n.service';
import ActionSheet from 'react-native-actionsheet';
import WireAction from '../newsfeed/activity/actions/WireAction';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import Button from '../common/components/Button';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import { CommonStyle as CS } from '../styles/Common';

const ButtonCustom = withPreventDoubleTap(Button);
/**
 * Channel Actions
 */
const title = 'Actions';
@observer
export default class ChannelActions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selected: '',
      scheduledCount: '',
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  componentWillMount() {
    this.getScheduledCount();
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  }

  handleSelection(i) {
    this.makeAction(i);
  }

  getOptions() {
    let options = [ i18n.t('cancel') ];

    if(this.props.store.channel.subscribed){
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

  makeAction(option) {
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
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    if (!this.props.store.loaded && sessionService.guid !== this.props.store.channel.guid )
      return null;
    if (sessionService.guid === this.props.store.channel.guid) {
      const viewScheduledButton = this.shouldRenderScheduledButton() ? (
        <ButtonCustom
          onPress={this.onViewScheduledAction}
          accessibilityLabel={i18n.t('channel.viewScheduled')}
          text={`${i18n.t('channel.viewScheduled').toUpperCase()}: ${this.state.scheduledCount}`}
          loading={this.state.saving}
          inverted={this.props.store.feedStore.endpoint == this.props.store.feedStore.scheduledEndpoint ? true : undefined}
        /> ) : null ;
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          { viewScheduledButton }
          <ButtonCustom
            onPress={this.onEditAction}
            containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
            accessibilityLabel={this.props.editing ? i18n.t('channel.saveChanges') : i18n.t('channel.editChannel')}
            text={this.props.editing ? i18n.t('save').toUpperCase() : i18n.t('edit').toUpperCase()}
            loading={this.props.saving}
          />
        </View>
      );
    } else if (!!this.props.store.channel.subscribed) {
      return (
        <ButtonCustom
          onPress={ this.navToConversation }
          containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
          accessibilityLabel={i18n.t('channel.sendMessage')}
          text={i18n.t('channel.message')}
        />
      );
    } else if (sessionService.guid !== this.props.store.channel.guid) {
      return (
        <ButtonCustom
          onPress={this.toggleSubscription}
          containerStyle={[CS.rowJustifyCenter, CS.marginLeft0x]}
          accessibilityLabel={i18n.t('channel.subscribeMessage')}
          text={i18n.t('channel.subscribe').toUpperCase()}
        />
      );
    } else if (this.props.store.isUploading) {
      return (
        <ActivityIndicator size="small" />
      )
    }
  }

  /**
   * Render Header
   */
  render() {

    const channel = this.props.store.channel;
    const showWire = !channel.blocked && !channel.isOwner() && featuresService.has('crypto');

    return (
      <View style={[CS.rowJustifyEnd, CS.marginTop2x]}>
        {this.getActionButton()}
        {!!showWire &&
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
        {!channel.isOwner() &&
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
          title={title}
          options={this.getOptions()}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
	wrapper: {
    backgroundColor: '#FFF',
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 40,
  },
  icon: {
    paddingLeft: 10,
    color: '#888888',
  },
});

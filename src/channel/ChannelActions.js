import React, {
  Component
} from 'react';

import {
  Text,
  Image,
  View,
  ActivityIndicator,
  Button,
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
    }

    this.handleSelection = this.handleSelection.bind(this);
  }

  showActionSheet() {
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

  /**
   * Render Header
   */
  render() {

    const channel = this.props.store.channel;
    const showWire = !channel.blocked && !channel.isOwner() && featuresService.has('crypto');

    return (
      <View style={styles.wrapper}>
        {!!showWire && <WireAction owner={this.props.store.channel} navigation={this.props.navigation}/>}
        <Icon name="md-settings" style={ styles.icon } onPress={() => this.showActionSheet()} size={24} />
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
    width: featuresService.has('crypto') ? 60 : 40,
    height: 40,
  },
  icon: {
    paddingLeft: 10,
    color: '#888888',
  },
});

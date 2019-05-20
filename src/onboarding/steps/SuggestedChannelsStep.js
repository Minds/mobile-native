import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import DiscoveryUser from '../../discovery/DiscoveryUser';
import i18n from '../../common/services/i18n.service';

@inject('onboarding')
@observer
export default class SuggestedChannelsStep extends Component {

  componentWillMount() {
    this.props.onboarding.suggestedUsers.list.clearList();
    this.props.onboarding.getSuggestedUsers();
  }

  renderUser = (user) => {
    return <DiscoveryUser
      store={this.props.onboarding.suggestedUsers}
      entity={{item: user}}
      key={user.guid}
    />
  }

  render() {
    return (
      <View>
        <View style={[CS.padding4x]}>
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>{i18n.t('onboarding.suggestedChannels')}</Text>
          <Text style={[CS.fontL, CS.colorDarkGreyed, CS.marginBottom3x]}>{i18n.t('onboarding.suggestedChannelsDescription')}</Text>
        </View>
        {!this.props.onboarding.suggestedUsers.list.loaded && <ActivityIndicator/>}
        {this.props.onboarding.suggestedUsers.list.entities.map(user => this.renderUser(user))}
      </View>
    );
  }
}
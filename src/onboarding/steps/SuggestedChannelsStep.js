import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import DiscoveryUser from '../../discovery/DiscoveryUser';

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
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>Suggested channels</Text>
          <Text style={[CS.fontL, CS.colorDarkGreyed, CS.marginBottom3x]}>Subscribe to some popular channels below based on your interests</Text>
        </View>
        {!this.props.onboarding.suggestedUsers.list.loaded && <ActivityIndicator/>}
        {this.props.onboarding.suggestedUsers.list.entities.map(user => this.renderUser(user))}
      </View>
    );
  }
}
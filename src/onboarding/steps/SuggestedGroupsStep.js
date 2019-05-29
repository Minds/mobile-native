import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import GroupsListItem from '../../groups/GroupsListItem';
import i18n from '../../common/services/i18n.service';

@inject('groups', 'hashtag')
@observer
export default class SuggestedGroupsStep extends Component {

  componentWillMount() {
    this.props.hashtag.setAll(true);
    this.props.groups.reset();
    this.props.groups.loadList();
  }

  renderGroup = (group) => {
    return  <GroupsListItem key={group.guid} group={group}/>
  }

  render() {
    return (
      <View>
        <View style={[CS.padding4x]}>
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>{i18n.t('onboarding.suggestedGroups')}</Text>
          <Text style={[CS.fontL, CS.colorDarkGreyed, CS.marginBottom3x]}>{i18n.t('onboarding.suggestedGroupsDescription')}</Text>
        </View>
        {this.props.groups.list.entities.map(group => this.renderGroup(group))}
      </View>
    );
  }
}
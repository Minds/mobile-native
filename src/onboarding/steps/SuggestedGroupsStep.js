import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import GroupsListItem from '../../groups/GroupsListItem';

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
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>Suggested groups</Text>
          <Text style={[CS.fontL, CS.colorDarkGreyed, CS.marginBottom3x]}>Join some popular groups below based on your interests </Text>
        </View>
        {this.props.groups.list.entities.map(group => this.renderGroup(group))}
      </View>
    );
  }
}
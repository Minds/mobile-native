import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  ScrollView,
} from 'react-native'

import {CommonStyle as CS} from '../styles/Common';
import GrousBarItem from './GroupsBarItem';

@inject('groupsBar')
@observer
export default class GroupsBar extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.groupsBar.loadGroups();
    this.props.groupsBar.loadMarkers();
  }

  /**
   * on group select
   * @param {object} group
   */
  onGroupSelect(group) {
    console.log(group);
  }

  /**
   * Render
   */
  render() {
    return (
      <ScrollView contentContainerStyle={[CS.rowJustifyStart, CS.paddingTop2x, CS.paddingBottom2x, CS.marginLeft]} horizontal={true}>
        {this.props.groupsBar.groups.slice().map((group, i) => <GrousBarItem group={group} key={i}/>)}
      </ScrollView>
    )
  }
}
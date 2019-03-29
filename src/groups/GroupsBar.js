import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  FlatList,
} from 'react-native'

import {CommonStyle as CS} from '../styles/Common';
import GrousBarItem from './GroupsBarItem';

@inject('groupsBar')
@observer
export default class GroupsBar extends Component {

  async componentDidMount() {
    await this.props.groupsBar.loadGroups();
    this.props.groupsBar.loadMarkers();
  }

  /**
   * Render group items
   * @param {object} row
   * @param {number} i
   */
  renderItem = (row, i) => {
    return <GrousBarItem group={row.item} key={i}/>
  }

  loadMore = () => {
    this.props.groupsBar.loadGroups();
  }

  /**
   * Render
   */
  render() {
    return (
      <FlatList
        contentContainerStyle={[CS.rowJustifyStart, CS.backgroundTransparent]}
        horizontal={true}
        renderItem={this.renderItem}
        data={this.props.groupsBar.groups.slice()}
        onEndReached={this.loadMore}
      />
    )
  }
}
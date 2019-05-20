import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  FlatList, View,
} from 'react-native'

import {CommonStyle as CS} from '../styles/Common';
import GrousBarItem from './GroupsBarItem';
import { Text } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../common/services/i18n.service';


@inject('groupsBar')
@observer
export default class GroupsBar extends Component {

  state = {
    errorLoading: false,
  }

  componentDidMount() {
    this.load();
  }

  load = async() => {
    if (this.state.errorLoading) this.setState({errorLoading: false});
    try {
      await this.props.groupsBar.loadGroups();
      await this.props.groupsBar.loadMarkers();
    } catch (error) {
      this.setState({errorLoading: true});
    }
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

  renderError() {
    return (
      <TouchableOpacity onPress={this.load}>
        <View style={[CS.columnAlignCenter, CS.centered, CS.padding2x]}>
          <Text style={[CS.fontXS, CS.colorDanger, CS.marginBottom]}>{i18n.t('groups.errorLoading')}</Text>
          <Text style={[CS.fontS, CS.colorPrimary, CS.borderPrimary, CS.border, CS.borderRadius7x, CS.padding]}>{i18n.t('tryAgain')}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Render
   */
  render() {
    return (
      <FlatList
        ListFooterComponent={this.state.errorLoading ? this.renderError() : undefined}
        contentContainerStyle={[CS.rowJustifyStart, CS.backgroundTransparent]}
        horizontal={true}
        renderItem={this.renderItem}
        data={this.props.groupsBar.groups.slice()}
        onEndReached={this.loadMore}
      />
    )
  }
}
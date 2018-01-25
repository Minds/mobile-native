import React, {
  Component
} from 'react';

import {
  Text,
  FlatList,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { CommonStyle } from '../../styles/Common';
import CenteredLoading from '../../common/components/CenteredLoading';
import token from "../../common/helpers/token";
import formatDate from "../../common/helpers/date";

/**
 * Rewards view
 */
@inject('wallet')
@observer
export default class RewardsView extends Component {

  componentWillUnmount() {
    this.props.wallet.ledger.list.clearList();
  }

  componentWillMount() {
    this.props.wallet.ledger.list.clearList();
    this.loadMore();
  }

  render() {
    const wallet = this.props.wallet;
    const entities = wallet.ledger.list.entities;

    if (!wallet.ledger.list.loaded) {
      return <CenteredLoading />
    }
    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={item => item.guid}
        onRefresh={this.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}
      />
    )
  }

  loadMore = () => {
    this.props.wallet.ledger.loadList();
  }

  renderRow = (row) => {
    const item = row.item;
    return (
      <View>
        <Text style={[CommonStyle.fontXL, {color: 'green'}]}>+{token(item.amount)}</Text>
        <View style={CommonStyle.rowJustifyStart}>
          <Text style={[CommonStyle.fontS, CommonStyle.flexContainer]}>{item.type.toUpperCase()}</Text>
          <Text style={[CommonStyle.fontS]}>{formatDate(+item.timestamp)}</Text>
        </View>
      </View>
    )
  }

  refresh = () => {
    this.props.wallet.ledger.refresh();
  }
}

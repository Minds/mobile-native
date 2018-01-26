import React, {
  Component
} from 'react';

import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import { CommonStyle } from '../../styles/Common';
import CenteredLoading from '../../common/components/CenteredLoading';
import token from "../../common/helpers/token";
import i18n from '../../common/services/i18n.service';
import DateRangePicker from '../../common/components/DateRangePicker';

/**
 * Rewards view
 */
@inject('wallet')
@observer
export default class RewardsView extends Component {

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.wallet.ledger.list.clearList();
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    this.props.wallet.ledger.setMode('rewards');
    this.props.wallet.ledger.list.clearList();

    const end = new Date();
    const start   = new Date();

    end.setHours(23, 59, 59);
    start.setMonth(start.getMonth() - 1);
    start.setHours(0, 0, 0);

    this.setState({
      from: start,
      to: end
    }, () => {
      this.loadMore();
    });
  }

  /**
   * Render
   */
  render() {
    const wallet = this.props.wallet;
    const entities = wallet.ledger.list.entities;

    if (!wallet.ledger.list.loaded || !this.state.to) {
      return <CenteredLoading />
    }

    const header = this.getHeader();

    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => item.timestamp+index}
        onRefresh={this.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        //ListHeaderComponent={header}
        style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}
      />
    )
  }

  /**
   * Get header
   */
  getHeader() {
    return (
      <DateRangePicker
        to={this.state.to}
        from={this.state.from}
        onToChange={this.setTo}
        onFromChange={this.setFrom}
      />
    )
  }

  /**
   * Set to date
   */
  setTo = (value) => {
    this.setState({toVisible: false, to: value}, () => {
      this.refresh();
    });
  }

  /**
   * Set from date
   */
  setFrom = (value) => {
    this.setState({fromVisible: false, from: value}, () => {
      this.refresh();
    });
  }

  /**
   * Load more data
   */
  loadMore = () => {
    this.props.wallet.ledger.loadList(this.state.from, this.state.to);
  }

  /**
   * Render list's rows
   */
  renderRow = (row) => {
    const item = row.item;
    return (
      <View style={[ styles.row]}>
        { item.amount >= 0 ?
          <Text style={[styles.count, styles.positive]}>+ {token(item.amount)}</Text>
          : <Text style={[styles.count, styles.negative]}>{token(item.amount)}</Text>
        }
        <View style={CommonStyle.rowJustifyStart}>
          <Text style={[styles.subtext, CommonStyle.flexContainer]}>{item.type.toUpperCase()}</Text>
          <Text style={[styles.subtext]}>{i18n.l('date.formats.small', item.timestamp)}</Text>
        </View>
      </View>
    )
  }

  /**
   * Refresh list
   */
  refresh = () => {
    this.props.wallet.ledger.refresh(this.state.from, this.state.to);
  }
}

const styles = StyleSheet.create({
  row: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  subtext: {
    fontSize: 11,
    color: '#555',
  },
});

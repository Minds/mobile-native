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

import { CommonStyle } from '../../../styles/Common';
import CenteredLoading from '../../../common/components/CenteredLoading';
import token from "../../../common/helpers/token";
import i18n from '../../../common/services/i18n.service';
import DateRangePicker from '../../../common/components/DateRangePicker';
import ContributionRow from './ContributionRow';

/**
 * Contributions view
 */
@inject('wallet')
@observer
export default class ContributionsView extends Component {

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
    this.props.wallet.ledger.setMode('contributions');
    this.props.wallet.ledger.list.clearList();

    const end = new Date();
    const start = new Date();

    end.setHours(23, 59, 59);
    start.setDate(start.getDate() - 7);
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

    let empty = (<CenteredLoading />);

    const header = this.getHeader();

    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => item.timestamp + index}
        onRefresh={this.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={this.loadMore}
        // onEndReachedThreshold={0}
        ListHeaderComponent={header}
        ListEmptyComponent={(!wallet.ledger.list.loaded || !this.state.to) ? empty : <View />}
        style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}
      />
    )
  }

  /**
   * Get header
   */
  getHeader() {
    /*return (
      <DateRangePicker
        to={this.state.to}
        from={this.state.from}
        onToChange={this.setTo}
        onFromChange={this.setFrom}
      />
    )*/
    return (
      <View style={styles.header}>
        <View style={[CommonStyle.rowJustifyStart, styles.row]}>
          <Text style={[CommonStyle.flexContainer, {fontWeight: '800', fontSize: 10 }]}>Date</Text>
          <Text style={[CommonStyle.flexContainer, {fontWeight: '800', fontSize: 10 }]}>Score</Text>
          <Text style={[CommonStyle.flexContainer, {fontWeight: '800', fontSize: 10 }]}>Share</Text>
        </View>
      </View>
    );
  }

  /**
   * Set to date
   */
  setTo = (value) => {
    this.setState({ toVisible: false, to: value }, () => {
      this.refresh();
    });
  }

  /**
   * Set from date
   */
  setFrom = (value) => {
    this.setState({ fromVisible: false, from: value }, () => {
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
  renderRow = (row, i) => {
    const item = row.item;
    return (
      <ContributionRow item={item} key={i} />
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
  header: {
    paddingTop: 5,
    //paddingBottom: 15,
    //borderBottomWidth: 1,
    //borderBottomColor: '#ececec',
  },
  row: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  column: {
    color: '#555',
  },
});

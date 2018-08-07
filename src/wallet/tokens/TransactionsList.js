import React, {
  Component
} from 'react';

import {
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  NavigationActions
} from 'react-navigation';

import { CommonStyle } from '../../styles/Common';
import CenteredLoading from '../../common/components/CenteredLoading';
import token from "../../common/helpers/token";
import i18n from '../../common/services/i18n.service';
import DateRangePicker from '../../common/components/DateRangePicker';
import Colors from '../../styles/Colors';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import Touchable from '../../common/components/Touchable';
import channelAvatarUrl from '../../common/helpers/channel-avatar-url';
import navigationService from '../../common/services/navigation.service';

/**
 * Rewards view
 */
@inject('wallet', 'user')
@observer
export default class TransactionsList extends Component {

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
    this.props.wallet.ledger.setMode('transactions');
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

    const header = this.getHeader();

    return (
      <FlatList
        data={entities.slice()}
        renderItem={this.renderRow}
        keyExtractor={(item, index) => (item.timestamp+index).toString()}
        onRefresh={this.refresh}
        refreshing={wallet.ledger.list.refreshing}
        onEndReached={this.loadMore}
        onEndThreshold={0}
        ListEmptyComponent={!wallet.ledger.list.loaded && !wallet.ledger.list.refreshing? <CenteredLoading /> : null}
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

  //

  getSelf() {
    const user = this.props.user.me;

    return {
      avatar: channelAvatarUrl(user),
      username: user.username,
    }
  }

  getOther(transaction) {
    const self = this.props.user.me,
      isSender = transaction.sender.guid != self.guid,
      user = isSender ? transaction.sender : transaction.receiver;

    return {
      avatar: channelAvatarUrl(user),
      username: user.username,
      guid: user.guid,
      isSender,
    }
  }

  isP2p(transaction) {
    const contractName = this.getNormalizedContractName(transaction.contract);

    if (contractName === 'wire' || contractName === 'boost') {
      return !!transaction.sender && !!transaction.receiver;
    }
  }

  getNormalizedContractName(contractName) {
    return contractName.indexOf('offchain:') > -1 ? contractName.substr(9) : contractName;
  }

  navToChannel = guid => {
    navigationService.get()
      .dispatch(NavigationActions.navigate({ routeName: 'Channel', params: { guid } }));
  }

  /**
   * Render list's rows
   */
  renderRow = (row) => {
    const item = row.item,
      Sep = (<Text style={styles.rowColumnCellSep}>|</Text>),
      negative = item.amount < 0;

    return (
      <View style={[styles.row]}>
        <View style={[styles.rowColumn, styles.rowColumnAmount]}>
          <Text style={[styles.count, !negative && styles.positive, negative && styles.negative]}>
            {negative ? '-' : '+'} {Math.abs(token(item.amount)).toFixed(3)}
          </Text>

          {this.isP2p(item) && <View style={styles.rowColumn}>
            <Touchable onPress={() => this.navToChannel(this.getSelf().guid)}>
              <Image source={{ uri: this.getSelf().avatar }} style={[styles.rowColumnCellAvatar, styles.rowColumnCellSpacing]} />
            </Touchable>

            <MdIcon style={styles.rowColumnCellSpacing} name={this.getOther(item).isSender ? 'arrow-back' : 'arrow-forward'} size={20} color="#555" />

            <Touchable onPress={() => this.navToChannel(this.getOther(item).guid)}>
              <Image source={{ uri: this.getOther(item).avatar }} style={[styles.rowColumnCellAvatar, styles.rowColumnCellSpacing]} />
            </Touchable>
          </View>}
        </View>

        <View style={styles.rowColumn}>
          <Text style={[styles.subtext, styles.rowColumnCell]}>{this.getNormalizedContractName(item.contract).toUpperCase()} {Sep}</Text>
          <Text style={[styles.subtext, styles.rowColumnCell]}>{item.wallet_address} {Sep}</Text>
          <Text style={[styles.subtext, styles.rowColumnCellRight]}>{i18n.l('datetime.formats.small', item.timestamp * 1000)}</Text>
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
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
    flexGrow: 1,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
  },
  rowColumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowColumnNotFirst: {
    marginTop: 10,
  },
  rowColumnCell: {
    marginLeft: 2,
  },
  rowColumnAmount: {
    marginBottom: 10,
  },
  rowColumnCellSep: {
    fontSize: 14,
    color: Colors.greyed,
  },
  rowColumnCellRight: {
    flexGrow: 1,
    textAlign: 'right',
  },
  rowColumnCellSpacing: {
    marginLeft: 3,
  },
  rowColumnCellAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  rowColumnCellUsername: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#555',
  }
});

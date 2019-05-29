import React, {
  Component
} from 'react';

import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import JoinView from './JoinView';

import WithdrawService from './WithdrawService';

import TransparentButton from '../../common/components/TransparentButton';

import Colors from '../../styles/Colors';
import number from '../../common/helpers/number';
import formatDate from '../../common/helpers/date';
import token from '../../common/helpers/token';
import readableError from '../../common/helpers/readable-error';
import i18n from '../../common/services/i18n.service';

@inject('user', 'withdraw')
@observer
export default class WithdrawScreen extends Component {
  state = {
    amount: '0',
    inProgress: false,
    error: '',
    hasWithdrawnToday: false,
    balance: 0,
    available: 0,
    withholding: 0,
  };

  static navigationOptions = {
    title: 'Withdraw'
  };

  async componentWillMount() {
    return await Promise.all([
      this.load(),
      this.loadLedger()
    ]);
  }

  async load() {
    try {
      this.setState({ inProgress: true });

      await Promise.all([
        this.checkPreviousWithdrawals(),
        this.getBalance()
      ]);
    } catch (e) {
      const error = (e && e.message) || i18n.t('wallet.withdraw.errorReadingStatus');
      this.setState({ error });
    } finally {
      this.setState({ inProgress: false });
    }
  }

  async loadLedger() {
    await this.props.withdraw.load();
  }

  async checkPreviousWithdrawals() {
    const hasWithdrawnToday = !(await WithdrawService.canWithdraw());

    this.setState({ hasWithdrawnToday });

    if (hasWithdrawnToday) {
      throw new Error(i18n.t('wallet.withdraw.errorOnlyOnceDay'));
    }
  }

  async getBalance() {
    const { balance, available } = await WithdrawService.getBalance();

    let withholding = 0;

    if (balance > available) {
      withholding = balance - available;
    }

    this.setState({ balance, available, withholding });
    this.setAmount(available);
  }

  canWithdraw() {
    return !this.state.hasWithdrawnToday &&
      !this.state.inProgress &&
      parseFloat(this.state.amount) > 0 &&
      parseFloat(this.state.amount) <= this.state.available;
  }

  async withdraw() {
    this.setState({ inProgress: true, error: '' });

    try {
      await this.props.withdraw.withdraw(this.props.user.me.guid, parseFloat(this.state.amount));
      this.setState({ amount: '0' });
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        const error = (e && e.message) || i18n.t('wallet.withdraw.errorWithdrawing');
        this.setState({ error: readableError(error) });
      }
    } finally {
      this.setState({ inProgress: false });
    }
  }

  withdrawAction = () => this.withdraw();

  setAmount = amount => {
    if (typeof amount === 'string') {
      amount = amount.replace(/,/g, '');
    }

    if (typeof amount === 'string' && amount.substring(amount.length - 1) === '.') {
      // Nothing, since we're inputting numbers, let's keep the dot
    } else if (typeof amount === 'string' && !isNaN(+amount - parseFloat(amount))) {
      amount = `${+amount}`;
    }

    this.setState({ amount });
  };

  getAmount() {
    if (!this.state.amount && this.state.amount !== 0) {
      return '';
    }

    let withDot = false;
    if (typeof this.state.amount === 'string' && this.state.amount.substring(this.state.amount.length - 1) === '.') {
      withDot = true;
    }

    try {
      return `${number(this.state.amount, 0, 4)}` + (withDot ? '.' : '');
    } catch (e) {
      return `${this.state.amount}`;
    }
  }

  getFormPartial = () => {
    let withdrawButonContent = 'WITHDRAW';

    if (this.state.inProgress) {
      withdrawButonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View style={style.formWrapperView}>
        <Text style={style.legendText}>
          {i18n.t('wallet.withdraw.youCanRequest')}
          {
            !!this.state.withholding ?
            i18n.t('wallet.withdraw.holdingMessage',{amount: number(this.state.withholding, 0, 4)})  : ''
          }
        </Text>

        <View style={style.formView}>
          <TextInput
            editable={!this.state.inProgress}
            style={style.amountTextInput}
            placeholder={i18n.t('wallet.withdraw.amount')}
            keyboardType="numeric"
            returnKeyType="go"
            onChangeText={this.setAmount}
            value={this.getAmount()}
          />

          <TransparentButton
            disabled={!this.canWithdraw()}
            style={style.withdrawButton}
            color={Colors.primary}
            disabledColor={Colors.greyed}
            title={withdrawButonContent}
            onPress={this.withdrawAction}
          />
        </View>

        {!!this.state.error && <Text style={style.errorText}>
          {this.state.error}
        </Text>}
      </View>
    );
  }

  getLedgerItemPartial = ({ item }) => {
    return (
      <View style={style.ledgerItem}>
        <View style={style.ledgerItemMeta}>
          <Text style={style.ledgerItemDate}>{formatDate(item.timestamp, 'date')}</Text>
          <Text style={style.ledgerItemStatus}>{item.completed ? i18n.t('completed').toUpperCase() : i18n.t('pending').toUpperCase()}</Text>
        </View>

        <Text style={style.ledgerItemAmount}>
          {number(token(item.amount), 0, 3)}
        </Text>
      </View>
    );
  };

  ledgerKeyExtractor = item => `${item.timestamp}_${item.tx}`;

  render() {
    const ledger = this.props.withdraw.ledger,
      formPartial = this.getFormPartial();

    if (!this.props.user.me.rewards) {
      return (
        <View style={style.view}>
          <JoinView />
        </View>
      );
    }

    return (
      <FlatList
        style={style.view}
        data={ledger}
        renderItem={this.getLedgerItemPartial}
        keyExtractor={this.ledgerKeyExtractor}
        ListHeaderComponent={formPartial}
      />
    );
  }
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  formWrapperView: {
    paddingBottom: 30,
  },
  legendText: {
    color: Colors.darkGreyed,
    marginBottom: 20,
    letterSpacing: 0.35,
  },
  formView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountTextInput: {
    flexGrow: 1,
    marginRight: 10,
    padding: 8,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  withdrawButton: {
    minWidth: 100,
  },
  errorText: {
    marginTop: 20,
    color: '#c00',
    fontSize: 14,
    textAlign: 'center',
  },
  ledgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  ledgerItemMeta: {
    flexGrow: 1,
  },
  ledgerItemDate: {
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 3
  },
  ledgerItemStatus: {
    fontSize: 11,
    letterSpacing: 0.35,
    color: Colors.darkGreyed,
  },
  ledgerItemAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: 'green',
  }
});

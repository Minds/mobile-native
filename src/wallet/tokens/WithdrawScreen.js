import React, {
  Component
} from 'react';

import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import WithdrawService from './WithdrawService';

import TransparentButton from '../../common/components/TransparentButton';

import Colors from '../../styles/Colors';
import number from '../../common/helpers/number';

@observer
@inject('user')
export default class WithdrawScreen extends Component {
  state = {
    amount: '0',
    inProgress: false,
    error: '',
    hasWithdrawnToday: false,
    balance: 0,
  };

  static navigationOptions = {
    title: 'Withdraw'
  };

  async componentWillMount() {
    try {
      this.setState({ inProgress: true });

      await Promise.all([
        this.checkPreviousWithdrawals(),
        this.getBalance()
      ]);
    } catch (e) {
      const error = (e && e.message) || 'Error reading withdrawal status';
      this.setState({ error });
    } finally {
      this.setState({ inProgress: false });
    }
  }

  async checkPreviousWithdrawals() {
    const hasWithdrawnToday = !(await WithdrawService.canWithdraw());

    this.setState({ hasWithdrawnToday });

    if (hasWithdrawnToday) {
      throw new Error('You can only withdraw once a day');
    }
  }

  async getBalance() {
    const balance = await WithdrawService.getBalance();

    this.setState({ balance });
    this.setAmount(balance);
  }

  canWithdraw() {
    return !this.state.hasWithdrawnToday &&
      !this.state.inProgress &&
      parseFloat(this.state.amount) > 0 &&
      parseFloat(this.state.amount) <= this.state.balance;
  }

  async withdraw() {
    this.setState({ inProgress: true, error: '' });

    try {
      const tx = await WithdrawService.withdraw(this.props.user.me.guid, parseFloat(this.state.amount));
    } catch (e) {
      if (!e || e.message !== 'E_CANCELLED') {
        const error = (e && e.message) || 'Error withdrawing tokens';
        this.setState({ error });
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

  render() {
    let withdrawButonContent = 'WITHDRAW';

    if (this.state.inProgress) {
      withdrawButonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View style={style.view}>
        <Text style={style.legendText}>
          You can request to withdraw your token rewards to your 'onchain' wallet below.
          Note: a small amount of ETH will be charged to cover the transaction fee.
          Withdrawals may take a few hours to complete.
        </Text>

        <View style={style.formView}>
          <TextInput
            editable={!this.state.inProgress}
            style={style.amountTextInput}
            placeholder="Amount"
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
}

const style = StyleSheet.create({
  view: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
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
  }
});

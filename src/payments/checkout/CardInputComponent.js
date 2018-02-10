import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Picker,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native';

import TransparentButton from '../../common/components/TransparentButton';

import Colors from '../../styles/Colors';

import CardType from './CardTypeComponent';
import creditCardType from '../../common/helpers/credit-card-type';

@inject('payments')
@observer
export default class CardInput extends Component {
  state = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    inProgress: false,
  }

  componentWillMount() {
    this.reset();
  }

  reset() {
    const now = new Date(),
      currentMonth = now.getMonth() + 1,
      currentYear = now.getFullYear();

    this.setState({
      number: '',
      expMonth: currentMonth,
      expYear: currentYear,
      cvc: '',
      name: ''
    });
  }

  validate() {
    card = this.getCard();

    if (!this.state.number) {
      throw new Error('E_INVALID_CARD_NUMBER');
    }

    if (!this.state.expMonth || !this.state.expYear) {
      throw new Error('E_INVALID_CARD_EXP_DATE');
    }

    if (!this.state.cvc) {
      throw new Error('E_INVALID_CARD_CVC');
    }

    if (!this.state.name) {
      throw new Error('E_INVALID_CARDHOLDER_NAME');
    }

    const now = new Date(),
      exp = new Date(`${this.state.expYear}-${this.state.expMonth}-1 00:00`);

    if (now.getTime() > exp.getTime()) {
      throw new Error('E_EXPIRED_CARD');
    }

    return true;
  }

  canSubmit() {
    try {
      this.validate();
      return true;
    } catch (e) {
      return false;
    }
  }

  async submit() {
    if (this.state.inProgress) {
      return;
    }

    this.setState({ inProgress: true });

    try {
      const card = await this.props.payments.createCardToken({
        number: this.state.number,
        exp_month: this.state.expMonth,
        exp_year: this.state.expYear,
        cvc: this.state.cvc,
        name: this.state.name,
      });

      const label = `${card.card.brand} **** ${card.card.last4} ${card.card.exp_month}/${card.card.exp_year}`;

      this.props.onConfirm({ token: card.id, label });

      this.reset();
    } catch (e) { } finally {
      this.setState({ inProgress: false });
    }
  }

  getCard() {
    return creditCardType(this.state.number);
  }

  //

  setNumber = number => this.setState({ number: `${number}`.replace(/[^0-9]/g, '') });

  getNumber() {
    const card = this.getCard();

    if (!card || !card.gaps) {
      return this.state.number;
    }

    const characters = this.state.number.split('');

    for (gap of card.gaps.reverse()) {
      if (characters.length < gap) {
        continue;
      }

      characters.splice(gap, 0, ' ');
    }

    return characters.join('').trim();
  }

  getMaxNumberLength() {
    const card = this.getCard();

    if (!card || !card.lengths) {
      return 16;
    }

    let maxLength = Math.max(...card.lengths);

    if (card.gaps) {
      maxLength += card.gaps.length;
    }

    return maxLength;
  }

  setExpMonth = expMonth => this.setState({ expMonth });

  setExpYear = expYear => this.setState({ expYear });

  setCvc = cvc => this.setState({ cvc });

  getCvcLabel() {
    const card = this.getCard();

    if (!card || !card.code) {
      return 'CVC / CVV';
    }

    return card.code.name.toUpperCase();
  }

  getCvcLength() {
    const card = this.getCard();

    return (card && card.code && card.code.size) || 4;
  }

  setName = name => this.setState({ name });

  // Partials

  getNumberPartial() {
    return (<View style={style.cell}>
      <TextInput
        style={style.textInput}
        placeholder="1111 2222 3333 4444"
        onChangeText={this.setNumber}
        value={this.getNumber()}
        disabled={this.props.inProgress}
        keyboardType="numeric"
        maxLength={this.getMaxNumberLength()}
      />
    </View>);
  }

  getExpDateSelectorPartial() {
    const now = new Date();

    const currentMonth = now.getMonth() + 1,
      monthItems = Array(12).fill()
        .map((value, i) => <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />);

    const currentYear = now.getFullYear(),
      yearItems = Array(20).fill()
        .map((value, i) => <Picker.Item key={i} label={`${i + currentYear}`} value={`${i + currentYear}`} />);

    return (<View style={[style.cell, style.rowView]}>
      <Picker
        style={[style.cell, style.picker]}
        itemStyle={style.pickerItem}
        selectedValue={this.state.expMonth}
        onValueChange={this.setExpMonth}
        enabled={!this.props.inProgress}
        prompt="Card Expiration Month"
      >{monthItems}</Picker>

      <Picker
        style={[style.cell, style.picker]}
        itemStyle={style.pickerItem}
        selectedValue={this.state.expYear}
        onValueChange={this.setExpYear}
        enabled={!this.props.inProgress}
        prompt="Card Expiration Year"
      >{yearItems}</Picker>
    </View>);
  }

  getCvcPartial() {
    return (<View style={style.cell}>
      <TextInput
        style={style.textInput}
        secureTextEntry={true}
        placeholder={this.getCvcLabel()}
        onChangeText={this.setCvc}
        value={this.state.cvc}
        disabled={this.props.inProgress}
        keyboardType="numeric"
        maxLength={this.getCvcLength()}
      />
    </View>);
  }

  getCardholderNamePartial() {
    return (<View style={style.cell}>
      <TextInput
        style={style.textInput}
        placeholder="Cardholder's name"
        onChangeText={this.setName}
        value={this.state.name}
        disabled={this.props.inProgress}
        autoCapitalize="words"
      />
    </View>);
  }

  submitAction = () => this.submit();

  //

  render() {
    return (
      <View style={[style.wrapper, this.props.style]}>
        <View style={style.rowView}>
          {this.getNumberPartial()}
        </View>

        <View style={style.rowView}>
          {this.getExpDateSelectorPartial()}

          {this.getCvcPartial()}
        </View>

        <View style={style.rowView}>
          {this.getCardholderNamePartial()}
        </View>

        <View style={style.rowView}>

          <View style={style.cell}>
            {!!this.state.number && <CardType
              number={this.state.number}
              color={colors.primary}
              style={style.cardType}
              labelStyle={style.cardTypeLabel}
              iconSize={20}
            />}
          </View>

          <View style={style.cell}>
            <TransparentButton
              color={this.canSubmit() ? Colors.primary : Colors.greyed}
              disabled={!this.canSubmit()}
              title={
                !this.state.inProgress ?
                  'Confirm' :
                  (<ActivityIndicator size="small" color={Colors.primary} />)
              }
              onPress={this.submitAction}
            />
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  wrapper: {
    justifyContent: 'flex-start',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cell: {
    flexGrow: 1,
    flexBasis: 0,
    padding: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.greyed,
    borderRadius: 4,
    padding: 8,
    fontSize: 18,
    textAlign: 'center'
  },
  picker: {
    padding: 0,
    margin: 0,
    height: 44
  },
  pickerItem: {
    padding: 0,
    margin: 0,
    height: 44,
    fontSize: 16,
  },
  cardType: {
    justifyContent: 'center'
  },
  cardTypeLabel: {
    fontSize: 16
  }
});

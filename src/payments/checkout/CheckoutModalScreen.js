import React, { Component } from 'react';

import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native';

import Colors from '../../styles/Colors';

import mindsService from '../../common/services/minds.service';

import CardList from './CardListComponent';
import CardInput from './CardInputComponent';
import { CommonStyle } from '../../styles/Common';

@inject('checkoutModal', 'payments')
@observer
export default class CheckoutModalScreen extends Component {
  disposeLeave;

  componentWillMount() {
    this.props.payments.load();
    this.disposeLeave = this.props.navigation.addListener('didBlur', () => this.props.checkoutModal.cancel(false));
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    if (this.disposeLeave) {
      this.disposeLeave();
      this.disposeLeave = void 0;
    }

    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = e => {
    this.props.checkoutModal.cancel();
    return true;
  };

  onExistingCardSelectAction = async ({ label, token }) => {
    Alert.alert(
      label,
      `${this.props.checkoutModal.opts.confirmMessage} Do you want to use this credit card?`.trim(),
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.checkoutModal.submit(token) }
      ]
    );
  };

  onNewCardConfirmAction = async ({ label, token }) => {
    Alert.alert(
      label,
      `${this.props.checkoutModal.opts.confirmMessage} Do you want to use this credit card?`.trim(),
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.checkoutModal.submit(token) }
      ]
    );
  };

  getCardList() {
    return (<View>
      {!!this.props.payments.cards.length && <Text style={style.title}>YOUR SAVED CARDS:</Text>}

      <CardList
        style={style.cardList}
        itemStyle={style.cardListItem}
        onSelect={this.onExistingCardSelectAction}
      />
    </View>);
  }

  getCardInput() {
    if (this.props.payments.inProgress) {
      return;
    }

    return (<View>
      <Text style={[
        style.title,
        !!this.props.payments.cards.length && CommonStyle.marginTop3x
      ]}>{
        !!this.props.payments.cards.length ?
          'OR USE ANOTHER CARD:' :
          'ENTER YOUR CARDS DETAILS:'
      }</Text>

      <CardInput
        style={style.cardInput}
        onConfirm={this.onNewCardConfirmAction}
      />
    </View>);
  }

  render() {
    return (<ScrollView style={style.view}>
      {this.props.checkoutModal.isActive && <View>
        {this.props.payments.inProgress && <ActivityIndicator size="large" />}

        {this.getCardList()}

        {this.getCardInput()}
      </View>}
    </ScrollView>)
  }
}

const style = StyleSheet.create({
  view: {
    paddingTop: 10,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 12,
    letterSpacing: 1,
    color: Colors.darkGreyed,
    marginLeft: 10,
    marginRight: 10,
  },
  cardList: {
    margin: 10,
    marginTop: 5,
  },
  cardListItem: {
    padding: 5
  },
  cardInput: {
    margin: 10,
    marginTop: 5,
    padding: 5,
    borderRadius: 8,
    borderColor: Colors.greyed,
    borderWidth: 1
  }
});

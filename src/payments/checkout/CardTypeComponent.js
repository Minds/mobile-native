import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import FaIcon from 'react-native-vector-icons/FontAwesome';

import { types } from 'credit-card-type';
import creditCardType from '../../common/helpers/credit-card-type';

export default class CardType extends Component {
  getIcon(type) {
    let icon;

    switch (type) {
      case types.VISA:
        icon = 'cc-visa';
        break;
      
      case types.MASTERCARD:
      case types.MAESTRO:
        icon = 'cc-mastercard';
        break;
      
      case types.DISCOVER:
        icon = 'cc-discover';
        break;
      
      case types.AMERICAN_EXPRESS:
        icon = 'cc-amex';
        break;
      
      default:
        icon = 'credit-card';
        break;
    }

    return (<FaIcon style={style.icon} name={icon} color={this.props.color} size={this.props.iconSize || 16} />);
  }

  render() {
    const card = creditCardType(this.props.number, true) ;

    if (!card) {
      return <View style={this.props.style} />
    }

    return (<View style={[style.view, this.props.style]}>
      {this.getIcon(card.type)}
      {card && <Text style={[this.props.color && { color: this.props.color }, this.props.labelStyle ]}>{ card.niceType }</Text>}
    </View>);
  }
}

const style = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  }
});

import React, { Component } from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native';

import CardType from './CardTypeComponent';
import Touchable from '../../common/components/Touchable';
import Colors from '../../styles/Colors';

@inject('payments')
@observer
export default class CardList extends Component {
  componentWillMount() {
    this.props.payments.load();
  }

  ItemPartial = ({ item, index }) => {
    if (!item) {
      return null;
    }

    return (
      <Touchable
        style={[style.itemWrapper, index === 0 && style.firstItemWrapper]}
        onPress={() => this.props.onSelect(item)}
      >
        <View style={this.props.itemStyle}>
          <Text style={style.itemText}>{item.label.toUpperCase()}</Text>
        </View>
      </Touchable>
    );
  };

  keyExtractor = item => item.token;

  render() {
    return (
      <FlatList
        style={this.props.style}
        data={this.props.payments.cards}
        renderItem={this.ItemPartial}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

const style = StyleSheet.create({
  itemWrapper: {
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: Colors.greyed,
    borderBottomWidth: 1,
  },
  firstItemWrapper: {
    borderTopWidth: 1,
  },
  itemText: {
    fontSize: 14,
    letterSpacing: 1,
  }
});

import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider } from 'react-native-elements'

import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';
import { Button } from 'react-native-elements';
import SettingsService from '../../settings/SettingsService';
import { ComponentsStyle } from '../../styles/Components';
import { getRates } from '../BoostService';
import CenteredLoading from '../../common/components/CenteredLoading';

import TypeSelector from './TypeSelector';
import PaymentSelector from './PaymentSelector';

/**
 * Boost Screen
 */
export default class BoostScreen extends Component {

  state = {
    type: 'feeds',
    payment: 'USD',
    amount: '2500',
    rates: null,
    priority: false,
    categories: []
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={[CommonStyle.backgroundLight, CommonStyle.rowJustifyStart]}>
        <Text style={[styles.titleText, CommonStyle.flexContainer, CommonStyle.padding2x]}>Boost</Text>
        <Icon size={36} name="ios-close" onPress={() => navigation.goBack()} style={CommonStyle.padding2x} />
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  });

  /**
   * On component will mount
   */
  componentWillMount() {
    getRates()
      .then(rates => {
        this.setState({ rates });
      })

    SettingsService.loadCategories()
      .then(categories => {
        this.setState({categories});
      })
  }

  /**
   * Change Amount
   */
  changeInput = (amount) => {
    this.setState({ amount });
  }

  /**
   * Change Type
   */
  changeType = (type) => {
    this.setState({type});
  }

  /**
   * Change payment method
   */
  changePayment = (payment) => {
    this.setState({ payment });
  }

  /**
   * Format Dolars
   */
  formatDolars(val) {
    return '$' + val;
  }

  /**
   * Calculate charges including priority
   */
  calcCharges(type) {
    const charges = parseFloat(this.calcBaseCharges(type));

    return charges + (charges * this.getPriorityRate());
  }

  /**
   * Gets the priority rate, only if applicable
   */
  getPriorityRate(force = false) {

    // NOTE: No priority on P2P
    if (force || (this.state.type != 'channels' && this.state.priority)) {

      return this.state.rates.priority;
    }

    return 0;
  }

  /**
   * Calculate priority charges (for its preview)
   */
  calcPriorityChargesPreview() {
    const value = this.calcBaseCharges(this.state.payment) * this.getPriorityRate(true);

    switch (this.state.payment) {
      case 'USD':
        return this.formatDolars(value) + ' USD';
      case 'TOKENS':
        return value + ' TOKENS';
      case 'REWARDS':
        return value + ' REWARDS';
    }
  }

  calcBaseCharges(type) {
    // P2P should just round down amount points. It's bid based.
    if (this.state.type === 'channels') {
      switch (type) {
        case 'REWARDS':
          return Math.floor(this.state.amount);
      }
      return this.state.amount;
    }

    // Non-P2P should do the views <-> ency conversion
    switch (type) {
      case 'USD':
        const usdFixRate = this.state.rates.usd / 100;
        return Math.ceil(this.state.amount / usdFixRate) / 100;
      case 'REWARDS':
        return Math.floor(this.state.amount / this.state.rates.rate);
      case 'TOKENS':
        const tokensFixRate = this.state.rates.tokens / 10000;
        return Math.ceil(this.state.amount / tokensFixRate) / 10000;
    }

    throw new Error('Unknown ency');
  }



  getCategories() {
    return (
      <View style={CommonStyle.rowJustifyStart}>
        <Text numberOfLines={20} style={[CommonStyle.padding, CommonStyle.fontXL]}>
        {
          this.state.categories.map((u, i) => {
            return (
              <Text key={i} style={u.selected ? styles.categorySelected : styles.category} onPress={() => this.toggleCategory(i)}>{u.label}  </Text>
            )
          })
        }
        </Text>
      </View>
    )
  }

  /**
   * Toggle a category
   */
  toggleCategory(i) {
    var categories = this.state.categories.slice();
    categories[i].selected = !categories[i].selected;
    this.setState({categories});
  }

  togglePriority = () => {
    this.setState({priority: !this.state.priority});
  }

  /**
   * Get priority
   */
  getPriority() {
    if (this.state.type == 'channels' || this.state.payment == 'REWARDS') {
      this.state.priority = false;
      return null;
    }

    let text = 'SELECT';
    const style = [CommonStyle.fontS];

    if (this.state.priority) {
      text = 'SELECTED';
      style.push(CommonStyle.colorPrimary);
    }

    return (
      <View>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />
        <Text style={styles.subtitleText}>PRIORITY</Text>
        <Text style={CommonStyle.fontS}>Priority content goes to the front of the line, but costs at least twice the price of a regular boost.</Text>
        <Text style={style} onPress={this.togglePriority}>{text} <Text style={CommonStyle.fontS}>+ {this.calcPriorityChargesPreview()}</Text></Text>
      </View>
    );
  }

  /**
   * Render
   */
  render() {
    if (!this.state.rates || this.state.categories.length == 0) {
      return <CenteredLoading/>
    }

    let amountTitle = 'HOW MANY VIEWS DO YOU WANT?';

    if (this.state.type == 'channels') {
      amountTitle = 'WHAT\'S YOUR OFFER ?';
    }

    const categories = this.getCategories();
    const priority = this.getPriority()

    return (
      <ScrollView style={[CommonStyle.flexContainer, CommonStyle.backgroundLight, CommonStyle.padding2x]}>
        <Text style={[styles.subtitleText, CommonStyle.paddingBottom]}>BOOST TYPE</Text>
        <TypeSelector onChange={this.changeType}/>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}/>
        <Text style={styles.subtitleText}>{amountTitle}</Text>
        <View style={[CommonStyle.rowJustifyStart, CommonStyle.alignCenter, CommonStyle.paddingTop]}>
          <TextInput ref="input" onChangeText={this.changeInput} style={styles.input} underlineColorAndroid="transparent" value={this.state.amount} keyboardType="numeric" />
          {this.state.type == 'feeds' && <Text style={[CommonStyle.fontXXL, CommonStyle.paddingLeft2x]}>Views</Text>}
        </View>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />
        <Text style={styles.subtitleText}>PAYMEN METHOD</Text>
        <PaymentSelector onChange={this.changePayment} valueUsd={this.formatDolars(this.calcCharges('USD'))} valueTokens={this.calcCharges('TOKENS')} valueRewards={this.calcCharges('REWARDS')}/>
        {priority}
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />
        <Text style={styles.subtitleText}>TARGET</Text>
        {categories}
        <TouchableHighlight style={[ComponentsStyle.bluebutton, CommonStyle.backgroundPrimary, CommonStyle.marginTop2x, CommonStyle.marginBottom3x]}>
          <Text style={CommonStyle.colorWhite}>BOOST</Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  typeSelectorText: {
    fontSize: 16,
    textAlign: 'left'
  },
  typeSelectorSelectedText: {
    fontSize: 20,
    textAlign: 'left'
  },
  selectorText: {
    fontSize: 24
  },
  categorySelected: {
    fontStyle: 'italic',
    color: colors.primary,
    fontSize: 18
  },
  category: {
    fontStyle: 'italic',
    color: colors.dark,
    fontSize: 18
  },
  titleText: {
    fontSize: 28
  },
  subtitleText: {
    fontSize: 15,
    textAlign: 'left'
  },
  centered: {
    textAlign: 'center'
  },
  input: {
    fontSize: 50,
    color: '#666',
    width: '50%',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 0,
    textAlign: 'right',
  },
});

const typeOptions = [
  { text: 'FEEDS', icon: 'list', value: 'newsfeeds', textStyle: styles.typeSelectorText, selectedTextStyle: styles.typeSelectorSelectedText},
  { text: 'CHANNELS', icon: 'ios-people', iconType: 'ion', value: 'channels', textStyle: styles.typeSelectorText, selectedTextStyle: styles.typeSelectorSelectedText}
];

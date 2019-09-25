import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import featuresService from '../../common/services/features.service';
import { CommonStyle as CS } from '../../styles/Common';
import viewportPercentage from '../../common/helpers/viewportPercentage';
import i18n from '../../common/services/i18n.service';

const {value: slideWidth, viewportHeight} = viewportPercentage(75);
const {value: itemHorizontalMargin} = viewportPercentage(2);

const itemWidth = slideWidth + itemHorizontalMargin * 2;

/**
 * Subscriptions Tier Carousel
 */
export default class SubscriptionTierCarousel extends PureComponent {

  rewards = [];

  /**
   * Get Pluralized currency
   * @param {string} currency
   * @param {number} amount
   */
  getPluralizedCurrency(currency, amount) {
    switch (currency) {
      case 'tokens':
        return amount > 1 ? 'Tokens' : 'Token';
      case 'usd':
        return 'USD';
      case 'eth':
        return 'ETH';
      case 'btc':
        return 'BTC';
    }
  }

  /**
   * Get rewards
   */
  getRewards() {
    const rewards = [{
      amount: 0,
      description: i18n.t('wire.customDonation'),
    }];
    const methodsMap = [{ method: 'tokens', currency: 'tokens' }];

    if (featuresService.has('wire-multi-currency')) {
      methodsMap.push({ method: 'money', currency: 'usd' });
    }

    for (const { method, currency } of methodsMap) {
      if (this.props.rewards[method]) {
        for (const reward of this.props.rewards[method]) {
          const amount = parseInt(reward.amount);
          rewards.push({
            amount,
            description: reward.description,
            currency,
          });
        }
      }
    }

    return rewards;
  }

  /**
   * Set tier
   */
  setTier = (tier) => {
    if (this.props.setTier) {
      this.props.setTier(tier);
    }
    this.toggleModal();
  }

  /**
   * Renders a tier
   */
  _renderItem = (row) => {
    const amount = row.item.amount || this.props.amount;
    const currency = row.item.currency || this.props.currency;
    const recurring = this.props.recurring;
    const amountText = amount + ' ' + this.getPluralizedCurrency(currency, row.item.amount);

    const text = recurring ? i18n.t('wire.amountMonth', {amount: amountText}) : amountText;

    return (
      <View key={`rewards${row.item.amount}`} style={[CS.rowJustifyCenter, CS.backgroundLightGreyed, CS.borderRadius5x, CS.padding2x, CS.border, CS.borderGreyed]}>
        <View style={CS.columnAlignCenter}>
          <Text style={[CS.fontXXL, CS.fontMedium, CS.colorDark]}>{text}</Text>
          <Text numberOfLines={5} style={[CS.fontL, CS.fontHairline, CS.colorDark]}>{row.item.description}</Text>
        </View>
      </View>
    );
  }

  /**
   * Tier Selected
   */
  onSelected = (index) => {
    if (this.props.onTierSelected) {
      this.props.onTierSelected(this.rewards[index]);
    }
  }

  /**
   * Render
   */
  render() {
    this.rewards = this.getRewards();
    let current = this.rewards.findIndex(r => r.amount == this.props.amount && r.currency == this.props.currency);

    return (
      <View style={[]}>
        <Pagination
          dotsLength={this.rewards.length}
          activeDotIndex={current === -1 ? 0 : current}
          containerStyle={styles.paginatorContainer}
          dotStyle={styles.dot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
        <Carousel
          onSnapToItem={this.onSelected}
          containerCustomStyle={styles.carousel}
          enableSnap={true}
          // layout={'tinder'}
          layoutCardOffset={`10`}
          ref={(c) => { this._carousel = c; }}
          data={this.rewards}
          firstItem={current}
          renderItem={this._renderItem}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0}
          sliderWidth={viewportHeight}
          itemWidth={itemWidth}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  carousel: {
    flexGrow: 0,
  },
  paginatorContainer: {
    paddingVertical: 10
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(46, 46, 46, 0.92)'
  }
})
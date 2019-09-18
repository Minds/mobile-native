// @flow
import * as React from 'react';

import { Text, View, StyleSheet, Alert } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import { CommonStyle as CS } from '../../styles/Common';
import viewportPercentage from '../../common/helpers/viewportPercentage';
import Icon from 'react-native-vector-icons/FontAwesome';

import i18n from '../../common/services/i18n.service';

const {value: slideWidth, viewportHeight} = viewportPercentage(75);
const {value: itemHorizontalMargin} = viewportPercentage(2);

const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = {height: parseInt(itemWidth * 0.55)};

type PropsType = {
  paymentmethods: Array<any>,
  onCardSelected: Function,
  onCardDeleted: Function
};

/**
 * Stripe card Carousel
 */
export default class StripeCardCarousel extends React.PureComponent<PropsType> {

  carouselRef: ?React.ElementRef<Carousel>;

  /**
   * Constructor
   * @param {PropsType} props
   */
  constructor(props: PropsType) {
    super(props);

    if (props.paymentmethods && props.onCardSelected) {
      this.props.onCardSelected(props.paymentmethods[props.paymentmethods.length - 1]);
    }

    this.carouselRef = React.createRef();
  }

  /**
   * Component did update
   * @param {PropsType} prevProps
   */
  componentDidUpdate(prevProps: PropsType) {

    // if the array of cards changes we snap to the last item
    if (prevProps.paymentmethods !== this.props.paymentmethods) {
      setTimeout(() => {
        if (this.carouselRef && this.carouselRef.current) {
          this.carouselRef.current.snapToItem(this.props.paymentmethods.length);
        }
      }, 100);
    }
  }

  delete(card: any) {
    Alert.alert(
      i18n.t('confirmMessage'),
      i18n.t('payments.confirmDeleteCard'),
      [
        { text: i18n.t('cancel'), style: 'cancel' },
        { text: i18n.t('ok'), onPress: (): any => this.props.onCardDeleted(card) },
      ],
      { cancelable: false }
    );
  }

  /**
   * Renders a card
   * @param {Object} row
   */
  _renderItem = (row: any): React.Node => {

    const even = row.index % 2;
    return (

      <View
        key={`card${row.item.id}`}
        style={[itemHeight, even ? CS.backgroundPrimary : CS.backgroundTertiary, CS.borderRadius4x, CS.padding2x, CS.shadow]}
      >
          {this.getCardIcon(row.item.card_brand)}
          <Icon name="close" style={[CS.positionAbsoluteTopRight, CS.margin, CS.colorWhite]} size={25} onPress={(): any => this.delete(row.item)}/>
          <Text style={[CS.fontM, CS.fontMedium, CS.colorWhite, CS.paddingBottom2x]}>{row.item.card_country}</Text>
          <Text style={[CS.fontXL, CS.fontMedium, CS.colorWhite, CS.textCenter, CS.paddingTop3x]}>********** {row.item.card_last4}</Text>
          <Text numberOfLines={5} style={[CS.fontL, CS.fontHairline, CS.colorWhite, CS.textRight , CS.paddingTop3x]}>{row.item.card_expires}</Text>
      </View>
    );
  }

  /**
   * Get credit card icon
   * @param {string} card
   */
  getCardIcon(card: string): React.Node {
    let name;

    switch (card) {
      case 'visa':
        name = 'cc-visa';
        break;
      case 'amex':
        name = 'cc-amex';
        break;
      case 'mastercard':
        name = 'cc-mastercard';
        break;
      case 'jcb':
        name = 'cc-jcb';
        break;
      case 'discover':
        name = 'cc-discover';
        break;
      case 'diners':
        name = 'cc-diners-club';
        break;
      default:
        name = 'credit-card-alt'
    }
    return <Icon name={name} size={30} color="white"/>
  }

  /**
   * Card Selected
   * @param {number} index
   */
  onSelected = (index: number) => {
    if (this.props.onCardSelected) {
      this.props.onCardSelected(this.props.paymentmethods[index]);
    }
  }

  /**
   * Render
   */
  render(): React.Node {

    return (
      <Carousel
        layout={'stack'}
        layoutCardOffset={7}
        onSnapToItem={this.onSelected}
        firstItem={this.props.paymentmethods.length - 1}
        containerCustomStyle={styles.carousle}
        enableSnap={true}
        ref={this.carouselRef}
        data={ this.props.paymentmethods }
        renderItem={this._renderItem}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        sliderWidth={viewportHeight}
        itemWidth={itemWidth}
      />
    )
  }
}

const styles = StyleSheet.create({
  carousle: {
    flexGrow: 0,
  }
})
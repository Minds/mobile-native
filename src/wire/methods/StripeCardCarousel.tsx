import * as React from 'react';

import { Text, View, StyleSheet, Alert } from 'react-native';

import Carousel from 'react-native-snap-carousel';

import viewportPercentage from '../../common/helpers/viewportPercentage';
import Icon from 'react-native-vector-icons/FontAwesome';

import i18n from '../../common/services/i18n.service';
import type { StripeCard } from '../WireTypes';
import ThemedStyles from '../../styles/ThemedStyles';

const { value: slideWidth, viewportHeight } = viewportPercentage(50);
const { value: itemHorizontalMargin } = viewportPercentage(1);

const itemWidth = slideWidth + itemHorizontalMargin * 2;
const itemHeight = { height: Math.floor(itemWidth * 0.55) };

type PropsType = {
  paymentmethods: Array<StripeCard>;
  onCardSelected: Function;
  onCardDeleted: Function;
};

type Row = {
  index: number;
  item: StripeCard;
};

/**
 * Stripe card Carousel
 */
export default class StripeCardCarousel extends React.PureComponent<PropsType> {
  carouselRef?: any;

  /**
   * Constructor
   * @param {PropsType} props
   */
  constructor(props: PropsType) {
    super(props);

    if (props.paymentmethods && props.onCardSelected) {
      this.props.onCardSelected(
        props.paymentmethods[props.paymentmethods.length - 1],
      );
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
        {
          text: i18n.t('ok'),
          onPress: (): any => this.props.onCardDeleted(card),
        },
      ],
      { cancelable: false },
    );
  }

  /**
   * Renders a card
   * @param {Object} row
   */
  _renderItem = (row: Row): React.ReactNode => {
    const even = row.index % 2;
    const theme = ThemedStyles.style;
    return (
      <View
        key={`card${row.item.id}`}
        style={[
          itemHeight,
          even ? theme.backgroundPrimary : theme.backgroundTertiary,
          theme.borderRadius4x,
          theme.padding2x,
          styles.shadow,
        ]}>
        {this.getCardIcon(row.item.card_brand)}
        <Icon
          name="close"
          style={[
            theme.positionAbsoluteTopRight,
            theme.margin,
            theme.colorWhite,
          ]}
          size={25}
          onPress={(): any => this.delete(row.item)}
        />
        <Text
          style={[
            theme.fontM,
            theme.fontMedium,
            theme.colorWhite,
            theme.paddingBottom2x,
          ]}>
          {row.item.card_country}
        </Text>
        <Text
          style={[
            theme.fontXL,
            theme.fontMedium,
            theme.colorWhite,
            theme.textCenter,
            theme.paddingTop3x,
          ]}>
          ********** {row.item.card_last4}
        </Text>
        <Text
          numberOfLines={5}
          style={[
            theme.fontL,
            theme.fontHairline,
            theme.colorWhite,
            theme.textRight,
            theme.paddingTop3x,
          ]}>
          {row.item.card_expires}
        </Text>
      </View>
    );
  };

  /**
   * Get credit card icon
   * @param {string} card
   */
  getCardIcon(card: string): React.ReactNode {
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
        name = 'credit-card-alt';
    }
    return <Icon name={name} size={30} color="white" />;
  }

  /**
   * Card Selected
   */
  onSelected = (index: number) => {
    if (this.props.onCardSelected) {
      this.props.onCardSelected(this.props.paymentmethods[index]);
    }
  };

  /**
   * Render
   */
  render(): React.ReactNode {
    return (
      <Carousel
        layout={'stack'}
        layoutCardOffset={7}
        onSnapToItem={this.onSelected}
        firstItem={this.props.paymentmethods.length - 1}
        containerCustomStyle={styles.carousle}
        enableSnap={true}
        ref={this.carouselRef}
        data={this.props.paymentmethods}
        //@ts-ignore
        renderItem={this._renderItem}
        inactiveSlideScale={0.94}
        inactiveSlideOpacity={0.7}
        sliderWidth={viewportHeight}
        itemWidth={itemWidth}
      />
    );
  }
}

const styles = StyleSheet.create({
  carousle: {
    flexGrow: 0,
  },
  shadow: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

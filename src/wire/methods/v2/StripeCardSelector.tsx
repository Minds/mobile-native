import * as React from 'react';

import type { StripeCard } from '../../WireTypes';
import MenuItem from '../../../common/components/menus/MenuItem';
import ThemedStyles from '../../../styles/ThemedStyles';
import Selector from '../../../common/components/Selector';
import stripe, { initStripe } from '../../../common/services/stripe.service';
import api, { ApiResponse } from '../../../common/services/api.service';
import i18n from '../../../common/services/i18n.service';
import { showNotification } from '../../../../AppMessages';
import { Text, View } from 'react-native';

type PropsType = {
  onCardSelected: Function;
};

type StateType = {
  cards: Array<StripeCard>;
  loaded: boolean;
  current: number;
  inProgress: boolean;
};

interface StripeResponse extends ApiResponse {
  paymentmethods: Array<StripeCard>;
}

interface IntentResponse extends ApiResponse {
  intent: {
    client_secret: string;
    id: string;
  };
}

const selectValueExtractor = (item: StripeCard) =>
  item.card_brand.toUpperCase() +
  ' ending in ' +
  item.card_last4 +
  ' - Exp: ' +
  item.card_expires;
const selectIdExtractor = (item) => item.id;

/**
 * Stripe card selector v2
 */
export default class StripeCardSelector extends React.PureComponent<
  PropsType,
  StateType
> {
  intentKey = '';
  intentId = '';

  state = {
    cards: [],
    current: 0,
    loaded: false,
    inProgress: false,
  } as StateType;

  selectorRef = React.createRef<Selector>();

  /**
   * Component did mount
   */
  componentDidMount() {
    this.loadCards();
  }

  /**
   * On card deleted
   * @param {any} card
   */
  onCardDeleted = (card: any) => {
    const index = this.state.cards.findIndex((r: any): any => r === card);
    this.removeCard(index);
  };

  /**
   * Render
   */
  render(): React.ReactNode {
    const theme = ThemedStyles.style;

    const current = this.state.cards[this.state.current];

    const currentItem = current
      ? {
          title: selectValueExtractor(current),
          icon: { name: 'chevron-down', type: 'material-community' },
          onPress: () => this.selectorRef.current?.show(current.id),
        }
      : null;

    return (
      <View>
        <View style={[theme.rowJustifySpaceBetween, theme.padding2x]}>
          <Text>SELECT CARD</Text>
          <Text onPress={this.addNewCard}>Add Card</Text>
        </View>
        {current && (
          <>
            {!!currentItem && <MenuItem item={currentItem} />}
            <Selector
              ref={this.selectorRef}
              onItemSelect={this.selectCard}
              title={''}
              data={this.state.cards}
              valueExtractor={selectValueExtractor}
              keyExtractor={selectIdExtractor}
              textStyle={theme.fontXL}
              backdropOpacity={0.9}
            />
          </>
        )}
      </View>
    );
  }

  /**
   * Load cards
   */
  async loadCards(): Promise<void> {
    try {
      const result: StripeResponse = await api.get<StripeResponse>(
        'api/v2/payments/stripe/paymentmethods',
      );

      if (result && result.paymentmethods) {
        if (this.props.onCardSelected && result.paymentmethods.length > 0) {
          this.props.onCardSelected(result.paymentmethods[0]);
        }
        return this.setState({
          cards: result.paymentmethods.reverse(),
          loaded: true,
        });
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ loaded: true });
  }

  /**
   * Select card
   * @param card
   */
  selectCard = async (card: StripeCard) => {
    const index = this.state.cards.findIndex((c) => c === card);
    if (index < 0) return;
    this.setState({
      current: index,
    });
  };

  /**
   * Show error message
   * @param {string} message
   */
  showError(message: string) {
    showNotification(message + ' ' + i18n.t('tryAgain'));
  }

  /**
   * Get setup intent from server
   */
  async getSetupIntent(): Promise<boolean> {
    try {
      const { intent }: IntentResponse = await api.put<IntentResponse>(
        'api/v2/payments/stripe/intents/setup',
      );
      this.intentKey = intent.client_secret;
      this.intentId = intent.id;
      return true;
    } catch (err) {
      this.showError(i18n.t('cantReachServer'));
      return false;
    }
  }

  /**
   * Remove a credit card from the payment methods
   * @param {number} index
   */
  async removeCard(index: number): Promise<void> {
    if (this.state.inProgress) {
      return;
    }

    this.setState({ inProgress: true });

    try {
      await api.delete(
        'api/v2/payments/stripe/paymentmethods/' + this.state.cards[index].id,
      );

      const cards = this.state.cards.slice(0);
      cards.splice(index, 1);

      this.setState({ cards, inProgress: false });
    } catch (err) {
      this.setState({ inProgress: false });
    }
  }

  /**
   * Add a new credit card using a setup intent
   */
  addNewCard = async (): Promise<any> => {
    try {
      const intent = this.getSetupIntent();

      if (!intent) return;

      await initStripe();

      const paymentMethod = await stripe.paymentRequestWithCardForm({
        requiredBillingAddressFields: 'full',
      });

      const params = {
        paymentMethodId: paymentMethod.id,
        clientSecret: this.intentKey,
      };

      const { setupIntent, error } = await stripe.confirmSetupIntent(params);

      if (error) {
        throw error;
      }

      // we log the result
      console.log('Setup Intent Confirmed', setupIntent);

      // finally we save the card
      this.saveCard();
    } catch (err) {
      if (err.message && err.message === 'Cancelled by user') {
        return;
      }
      this.showError(err.message || i18n.t('errorMessage'));
      console.log(err);
    }
  };

  /**
   * Save card
   */
  async saveCard(): Promise<any> {
    await api.post<ApiResponse>('api/v2/payments/stripe/paymentmethods/apply', {
      intent_id: this.intentId,
    });

    this.intentKey = '';
    this.loadCards();
  }
}

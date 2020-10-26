import * as React from 'react';
import { View, Alert } from 'react-native';

import { CommonStyle as CS } from '../../styles/Common';
import api, { ApiResponse } from '../../common/services/api.service';
import stripe, { initStripe } from '../../common/services/stripe.service';
import Button from '../../common/components/Button';
import i18nService from '../../common/services/i18n.service';
import StripeCardCarousel from './StripeCardCarousel';
import type { StripeCard } from '../WireTypes';
import ActivityIndicator from '../../common/components/ActivityIndicator';

type PropsType = {
  onCardSelected: Function;
};

type StateType = {
  cards: Array<StripeCard>;
  loaded: boolean;
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

/**
 * Stripe card selector
 */
export default class StripeCardSelector extends React.PureComponent<
  PropsType,
  StateType
> {
  intentKey = '';
  intentId = '';

  state = {
    cards: [],
    loaded: false,
    inProgress: false,
  } as StateType;

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
    return (
      <View>
        {!this.state.loaded && <ActivityIndicator />}
        {this.state.cards.length > 0 && (
          <StripeCardCarousel
            paymentmethods={this.state.cards}
            onCardSelected={this.props.onCardSelected}
            onCardDeleted={this.onCardDeleted}
          />
        )}
        <View style={[CS.rowJustifyCenter, CS.marginTop2x]}>
          <Button
            text="Add Card"
            onPress={this.addNewCard}
            textStyle={[CS.padding]}
          />
        </View>
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
   * Show error message
   * @param {string} message
   */
  showError(message: string) {
    Alert.alert(message + '\n' + i18nService.t('tryAgain'));
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
      this.showError(i18nService.t('cantReachServer'));
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
      this.showError(err.message || i18nService.t('errorMessage'));
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

import * as React from 'react';
import { InteractionManager } from 'react-native';
import { showNotification } from '../../../../AppMessages';
import InputSelector from '../../../common/components/InputSelectorV2';
import api, { ApiResponse } from '../../../common/services/api.service';
import i18n from '../../../common/services/i18n.service';
import stripe, { initStripe } from '../../../common/services/stripe.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import type { StripeCard } from '../../WireTypes';

type PropsType = {
  selectedCardId?: string;
  onCardSelected: (card: StripeCard) => void;
  info?: string;
  error?: string;
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

const selectValueExtractor = (item: any) => {
  if (!item) return;

  if (item.name) {
    return item.name;
  }

  return (
    item.card_brand.toUpperCase() +
    ' ending in ' +
    item.card_last4 +
    ' - Exp: ' +
    item.card_expires
  );
};
const selectIdExtractor = item => item.id;

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

  selectorRef = React.createRef<any>();

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
   * Load cards
   */
  async loadCards(): Promise<void> {
    try {
      const result: StripeResponse = await api.get<StripeResponse>(
        'api/v2/payments/stripe/paymentmethods',
      );

      if (result && result.paymentmethods) {
        let defaultSelectedCard;
        if (this.props.onCardSelected && result.paymentmethods.length > 0) {
          defaultSelectedCard = result.paymentmethods[0];

          if (
            this.props.selectedCardId &&
            result.paymentmethods.find(p => p.id === this.props.selectedCardId)
          ) {
            defaultSelectedCard = result.paymentmethods.find(
              p => p.id === this.props.selectedCardId,
            )!;
          }
          this.props.onCardSelected(defaultSelectedCard);
        }

        const cards = result.paymentmethods.reverse();

        return this.setState({
          current: defaultSelectedCard
            ? cards.findIndex(p => p.id === defaultSelectedCard.id)
            : this.state.current,
          cards,
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
  selectCard = async (card: string) => {
    const index = this.state.cards.findIndex(
      c => selectIdExtractor(c) === card,
    );

    if (index < 0) return;

    this.props.onCardSelected?.(this.state.cards[index]);
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
      console.log(err);
      if (err instanceof Error) {
        if (err.message && err.message === 'Cancelled by user') {
          return;
        }
        this.showError(err.message || i18n.t('errorMessage'));
      } else {
        this.showError(i18n.t('errorMessage'));
      }
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

  /**
   * Render
   */
  render(): React.ReactNode {
    const theme = ThemedStyles.style;
    const current = this.state.cards[this.state.current];

    return (
      <InputSelector
        onSelected={this.selectCard}
        selected={current ? selectIdExtractor(current) : 'newCard'}
        label={i18n.t('buyTokensScreen.paymentMethod')}
        info={this.props.info}
        data={[
          ...this.state.cards,
          {
            name: i18n.t('wire.addCard'),
            id: 'newCard',
            iconName: 'add',
            onPress: () =>
              InteractionManager.runAfterInteractions(() => this.addNewCard()),
          },
        ]}
        error={this.props.error}
        valueExtractor={selectValueExtractor}
        keyExtractor={selectIdExtractor}
        textStyle={theme.fontXL}
        backdropOpacity={0.9}
      />
    );
  }
}

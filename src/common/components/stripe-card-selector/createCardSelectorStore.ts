import { CardFieldInput } from '@stripe/stripe-react-native';
import { showNotification } from '../../../../AppMessages';
import { StripeCard } from '../../../wire/WireTypes';
import api, { ApiResponse } from '../../services/api.service';
import i18nService from '../../services/i18n.service';
import { initStripe } from '../../services/stripe.service';

interface StripeResponse extends ApiResponse {
  paymentmethods: Array<StripeCard>;
}

interface IntentResponse extends ApiResponse {
  intent: {
    client_secret: string;
    id: string;
  };
}

export const selectValueExtractor = (item: StripeCard) =>
  item.card_brand.toUpperCase() +
  ' ending in ' +
  item.card_last4 +
  ' - Exp: ' +
  item.card_expires;
export const selectIdExtractor = item => item.id;

const createCardSelectorStore = ({ onCardSelected }) => ({
  loaded: false,
  cards: [] as Array<StripeCard>,
  current: 0,
  inProgress: false,
  cardDetails: {} as CardFieldInput.Details,
  intentKey: '',
  intentId: '',
  async init() {
    await initStripe();
    await this.loadCards();
    this.getSetupIntent();
    this.setLoaded(true);
  },
  setInProgress(inProgress: boolean) {
    this.inProgress = inProgress;
  },
  setLoaded(loaded: boolean) {
    this.loaded = loaded;
  },
  setCards(cards: Array<StripeCard>) {
    this.cards = cards;
  },
  get currentCard() {
    return this.cards[this.current];
  },
  get currentCardTitle() {
    return selectValueExtractor(this.currentCard);
  },
  get currentCardId() {
    return this.currentCard.id;
  },
  async loadCards() {
    try {
      const result: StripeResponse = await api.get<StripeResponse>(
        'api/v2/payments/stripe/paymentmethods',
      );

      if (result && result.paymentmethods) {
        if (onCardSelected && result.paymentmethods.length > 0) {
          onCardSelected(result.paymentmethods[0]);
        }

        if (result && result.paymentmethods) {
          this.setCards(result.paymentmethods.reverse());
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * Get setup intent from server
   */
  async getSetupIntent() {
    try {
      const { intent }: IntentResponse = await api.put<IntentResponse>(
        'api/v2/payments/stripe/intents/setup',
      );
      this.intentKey = intent.client_secret;
      this.intentId = intent.id;
    } catch (err) {
      showNotification(i18nService.t('cantReachServer'), 'danger');
    }
  },
  selectCard(card: StripeCard) {
    const index = this.cards.findIndex(c => c === card);
    if (index >= 0) {
      this.current = index;
    }
  },
  async saveCard(): Promise<any> {
    await api.post<ApiResponse>('api/v2/payments/stripe/paymentmethods/apply', {
      intent_id: this.intentId,
    });

    this.intentKey = '';
    await this.loadCards();
    this.setInProgress(false);
  },
  onCardChange(cardDetails: CardFieldInput.Details) {
    this.cardDetails = cardDetails;
  },
  get cardDetailsComplete() {
    return this.cardDetails.complete;
  },
});

export default createCardSelectorStore;
export type CardSelectorStore = ReturnType<typeof createCardSelectorStore>;

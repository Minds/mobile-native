import { CardFieldInput } from '@stripe/stripe-react-native';
import { showNotification } from '../../../../AppMessages';
import { StripeCard } from '../../../wire/WireTypes';
import api, { ApiResponse } from '../../services/api.service';
import i18nService from '../../services/i18n.service';
import logService from '../../services/log.service';
import { initStripe } from '../../services/stripe.service';
import { confirm } from '../Confirm';

interface StripeResponse extends ApiResponse {
  paymentmethods: Array<StripeCard>;
}

interface IntentResponse extends ApiResponse {
  intent: {
    client_secret: string;
    id: string;
  };
}

export const selectValueExtractor = (item: any) => {
  if (!item) {
    return;
  }

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
export const selectIdExtractor = item => item.id;

const createCardSelectorStore = ({ onCardSelected, selectedCardId }) => ({
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
    return this.currentCard?.id;
  },
  async loadCards() {
    try {
      const result: StripeResponse = await api.get<StripeResponse>(
        'api/v2/payments/stripe/paymentmethods',
      );

      if (result?.paymentmethods) {
        let defaultSelectedCard;
        if (result.paymentmethods.length > 0) {
          defaultSelectedCard = result.paymentmethods[0]?.id;

          if (
            selectedCardId &&
            result.paymentmethods.find(p => p.id === selectedCardId)
          ) {
            defaultSelectedCard = result.paymentmethods.find(
              p => p.id === selectedCardId,
            )!;
          }
        }

        const cards = result.paymentmethods.reverse();

        this.setCards(cards);
        this.setLoaded(true);
        if (defaultSelectedCard) {
          this.selectCard(defaultSelectedCard);
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
  selectCard(cardId: string) {
    const index = this.cards.findIndex(c => c.id === cardId);
    if (index >= 0) {
      onCardSelected?.(this.cards[index]);
      this.current = index;
    }
  },
  async saveCard(): Promise<any> {
    try {
      await api.post<ApiResponse>(
        'api/v2/payments/stripe/paymentmethods/apply',
        {
          intent_id: this.intentId,
        },
      );
      this.intentKey = '';
      this.setInProgress(false);
      this.loadCards();
    } catch (err) {
      logService.exception('[Stripe saveCard]', err);
      this.setInProgress(false);
    }
  },
  async removeCard(index: number) {
    if (!this.cards[index]) {
      return;
    }

    const confirmed = await confirm({
      title: 'Do you want to remove this card?',
      description: selectValueExtractor(this.cards[index]),
    });
    if (confirmed) {
      try {
        this.setInProgress(true);
        await api.delete(
          'api/v2/payments/stripe/paymentmethods/' + this.cards[index].id,
        );
        this.cards.splice(index, 1);
        if (this.current > this.cards.length - 1) {
          this.current = this.cards.length - 1;
        }
      } catch (error) {
        logService.exception('[Stripe removeCard]', error);
      } finally {
        this.setInProgress(false);
      }
    }
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

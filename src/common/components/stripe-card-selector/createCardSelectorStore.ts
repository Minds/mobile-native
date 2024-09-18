import { CardFieldInput } from '@stripe/stripe-react-native';
import { showNotification } from '~/../AppMessages';
import { StripeCard } from '~/wire/WireTypes';

import { confirm } from '../Confirm';
import { ApiResponse } from '~/common/services/ApiResponse';
import sp from '~/services/serviceProvider';

interface StripeResponse extends ApiResponse {
  paymentmethods: Array<StripeCard>;
}

interface IntentResponse extends ApiResponse {
  intent: {
    client_secret: string;
    id: string;
  };
}

export const GIFTSCARD: Partial<StripeCard> = {
  id: 'giftscard',
  card_brand: 'minds',
};

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
    const initStripe = require('~/common/services/stripe.service').initStripe;
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
    return this.current >= 0 ? this.cards[this.current] : GIFTSCARD;
  },
  get currentCardTitle() {
    return selectValueExtractor(this.currentCard);
  },
  get currentCardId() {
    return this.currentCard?.id;
  },
  async loadCards() {
    try {
      const result: StripeResponse = await sp.api.get<StripeResponse>(
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
            )!.id;
          }
        }

        const cards = result.paymentmethods.reverse();

        this.setCards(cards);
        this.setLoaded(true);

        if (selectedCardId === GIFTSCARD.id || defaultSelectedCard) {
          this.selectCard(
            selectedCardId === GIFTSCARD.id
              ? selectedCardId
              : defaultSelectedCard,
          );
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
      const { intent }: IntentResponse = await sp.api.put<IntentResponse>(
        'api/v2/payments/stripe/intents/setup',
      );
      this.intentKey = intent.client_secret;
      this.intentId = intent.id;
    } catch (err) {
      showNotification(sp.i18n.t('cantReachServer'), 'danger');
    }
  },
  selectCard(cardId: string) {
    const index = this.cards.findIndex(c => c.id === cardId);
    this.current = index;
    onCardSelected?.(index >= 0 ? this.cards[index] : GIFTSCARD);
  },
  async saveCard(): Promise<any> {
    try {
      await sp.api.post<ApiResponse>(
        'api/v2/payments/stripe/paymentmethods/apply',
        {
          intent_id: this.intentId,
        },
      );
      this.intentKey = '';
      this.setInProgress(false);
      this.loadCards();
    } catch (err) {
      sp.log.exception('[Stripe saveCard]', err);
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
        await sp.api.delete(
          'api/v2/payments/stripe/paymentmethods/' + this.cards[index].id,
        );
        this.cards.splice(index, 1);
        if (this.current > this.cards.length - 1) {
          this.current = this.cards.length - 1;
        }
      } catch (error) {
        sp.log.exception('[Stripe removeCard]', error);
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
  isGiftCards() {
    return this.currentCard?.id === GIFTSCARD.id;
  },
});

export default createCardSelectorStore;
export type CardSelectorStore = ReturnType<typeof createCardSelectorStore>;

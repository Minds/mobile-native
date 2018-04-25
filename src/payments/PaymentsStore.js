import {
  observable,
  action,
  observe
} from 'mobx';

import stripeFactory from 'stripe-client';

import api from '../common/services/api.service';
import mindsService from '../common/services/minds.service';

class PaymentsStore {
  @observable inProgress = false;
  @observable cards = [];

  @action async load() {
    try {
      this.inProgress = true;
      this.cards = [];

      const response = await api.get(`api/v1/payments/stripe/cards`);

      if (response.cards) {
        this.cards = response.cards.map(card => ({
          token: card.id,
          brand: (card.brand || 'generic').toLowerCase(),
          label: `${card.brand} **** ${card.last4} ${card.exp_month}/${card.exp_year}`
        }));
      }
    } catch (e) {
      console.error('PaymentsStore.load', e);
    } finally {
      this.inProgress = false;
    }
  }

  async createCardToken(payload) {
    const stripe = stripeFactory((await mindsService.getSettings()).stripe_key);

    const card = await stripe.createToken({
      card: payload
    });

    return card;
  }

  reset() {
    this.inProgress = false;
    this.cards = [];
  }
}

export default PaymentsStore;

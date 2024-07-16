import { ApiResponse } from './ApiResponse';
import type { ApiService } from './api.service';

export type SubscriptionType = {
  amount?: string;
  entity?: any;
  entity_guid?: string;
  guid?: string;
  id?: string;
  interval?: string;
  last_billing?: string;
  next_billing?: string;
  payment_method?: string;
  plan_id?: string;
  status?: string;
  user_guid?: string;
};

interface SubscriptionResponseType extends ApiResponse {
  subscriptions: SubscriptionType[];
}

export class PaymentService {
  constructor(private api: ApiService) {}
  async subscriptions() {
    const { subscriptions } = <SubscriptionResponseType>(
      await this.api.get('api/v1/payments/subscriptions')
    );
    return subscriptions;
  }

  async cancelSubscriptions(id) {
    await this.api.delete(`api/v1/payments/subscriptions/${id}`);
  }
}

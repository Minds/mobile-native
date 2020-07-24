import api, { ApiResponse } from './api.service';

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

class PaymentService {
  async subscriptions() {
    const { subscriptions } = <SubscriptionResponseType>(
      await api.get('api/v1/payments/subscriptions')
    );
    return subscriptions;
  }

  async cancelSubscriptions(id) {
    await api.delete(`api/v1/payments/subscriptions/${id}`);
  }
}

export default new PaymentService();

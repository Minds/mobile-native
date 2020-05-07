//@ts-nocheck
import api from './api.service';

class PaymentService {
  async subscriptions() {
    const { subscriptions } = await api.get('api/v1/payments/subscriptions');
    return subscriptions;
  }

  async cancelSubscriptions(id) {
    await api.delete(`api/v1/payments/subscriptions/${id}`);
  }
}

export default new PaymentService();

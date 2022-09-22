import { fakeOne } from '../ActivitiesFaker';

export default function supermindRequestFaker() {
  return {
    guid: '1',
    activity_guid: '1',
    sender_guid: '1',
    receiver_guid: '1',
    status: 1,
    payment_amount: 1,
    payment_method: 1,
    payment_txid: '',
    created_timestamp: 1662991439,
    expiry_threshold: 7 * 86400,
    twitter_required: false,
    reply_type: 1,
    entity: fakeOne(),
  };
}

import BaseModel from '~/common/BaseModel';

export enum BoostStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  REFUND_IN_PROGRESS = 4,
  REFUND_PROCESSED = 5,
  FAILED = 6,
  REPORTED = 7,
  PENDING_ONCHAIN_CONFIRMATION = 8,
  COMPLETED = 9,
  CANCELLED = 10,
}

export enum BoostPaymentMethod {
  cash = 1,
  token = 2,
}

export enum BoostTargetLocation {
  newsfeed = 1,
  sidebar = 2,
}

export enum BoostTargetSuitability {
  safe = 1,
  mature = 2,
}

export enum BoostRejectionReason {
  WRONG_AUDIENCE = 1,
  AGAINST_MINDS_BOOST_POLICY = 2,
  AGAINST_STRIPE_TERMS_OF_SERVICE = 3,
  ONCHAIN_PAYMENT_FAILED = 4,
}

export type BoostConsoleBoost = {
  approved_timestamp: number | null;
  boost_status: BoostStatus;
  created_timestamp: number;
  daily_bid: number;
  duration_days: number;
  entity: BaseModel[];
  entity_guid: string;
  guid: string;
  owner_guid: string;
  payment_amount: number;
  payment_method: BoostPaymentMethod;
  target_location: BoostTargetLocation;
  target_suitability: BoostTargetSuitability;
  updated_timestamp: number | null;
  urn: string;
};

import BaseModel from '~/common/BaseModel';

export enum BoostStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  REFUND_IN_PROGRESS = 4,
  REFUND_PROCESSED = 5,
  FAILED = 6,
  REPORTED = 7,
}

export enum BoostPaymentMethod {
  cash,
  token,
}

export enum BoostTargetLocation {
  newsfeed,
  sidebar,
}

export enum BoostTargetSuitability {
  safe,
  mature,
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

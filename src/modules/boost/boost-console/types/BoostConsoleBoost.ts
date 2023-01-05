import BaseModel from '../../../../common/BaseModel';

export enum BoostStatus {
  pending,
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

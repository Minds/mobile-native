export enum SupermindRequestStatus {
  PENDING = 0,
  CREATED = 1,
  ACCEPTED = 2,
  REVOKED = 3,
  REJECTED = 4,
  FAILED_PAYMENT = 5,
  FAILED = 6,
  EXPIRED = 7,
}

export enum SupermindRequestReplyType {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  LIVE = 3,
}

export enum SupermindRequestPaymentMethod {
  CASH = 0,
  OFFCHAIN_TOKEN = 1,
}

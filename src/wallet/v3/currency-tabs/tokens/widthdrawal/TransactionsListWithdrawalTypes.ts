// props type for a withdrawal.
export type WithdrawalItemPropsType = {
  withdrawal: {
    amount: number;
    timestamp: number;
    tx: string;
    status: WithdrawalStatus;
    completed_tx: string;
  };
};

// valid statuses.
export type WithdrawalStatus =
  | 'approved'
  | 'pending'
  | 'pending_review'
  | 'failed'
  | 'rejected'
  | '';

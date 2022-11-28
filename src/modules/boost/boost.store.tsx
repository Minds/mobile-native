import { useLocalStore } from 'mobx-react';
import React, { useContext } from 'react';
import { BoostType } from '../../boost/v2/createBoostStore';
import UserModel from '../../channel/UserModel';
import ActivityModel from '../../newsfeed/ActivityModel';

type BoostStoreParams = {
  boostType: BoostType;
  entity: UserModel | ActivityModel;
};

export const createBoostStore = ({ boostType, entity }: BoostStoreParams) => ({
  entity,
  boostType,
  audience: 'safe' as IBoostAudience,
  setAudience(audience: IBoostAudience) {
    this.audience = audience;
  },
  amount: 5,
  setAmount(amount: number) {
    this.amount = amount;
  },
  duration: 1,
  setDuration(duration: number) {
    this.duration = duration;
  },
  get total() {
    return this.amount * this.duration;
  },
  paymentType: 'cash' as IPaymentType,
  setPaymentType(paymentType: IPaymentType) {
    this.paymentType = paymentType;
  },
});

export type IBoostAudience = 'safe' | 'mature';
type IPaymentType = 'cash' | 'token';

export const BoostStoreContext = React.createContext<ReturnType<
  typeof createBoostStore
> | null>(null);

export function useBoostStore() {
  return useContext(BoostStoreContext)!;
}

export function BoostStoreProvider(
  props: React.PropsWithChildren<BoostStoreParams>,
) {
  const boostStore = useLocalStore(createBoostStore, props);
  return <BoostStoreContext.Provider {...props} value={boostStore} />;
}

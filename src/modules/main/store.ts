import createStore from 'teaful';
import { storages } from '~/common/services/storage/storages.service';

type SubscriptionStateType = {
  currentSubscription: string;
  partyKey: string;
  currentIndex: number;
};

export const {
  useStore: useSubscription,
  getStore: subscription,
  setStore: setSubscription,
} = createStore<SubscriptionStateType>({
  currentSubscription: '',
  partyKey: '',
  currentIndex: 0,
});

export const {
  useStore: useBottomSheet,
  getStore: bottomSheet,
  setStore: setBottomSheet,
} = createStore<{ visible: boolean }>({ visible: false });

export const {
  useStore: usePushToken,
  getStore: pushToken,
  setStore: setPushToken,
} = createStore<{ token: string | null }>({ token: null }, ({ store }) =>
  store.token
    ? storages.pushToken?.setItem('pushToken', store.token)
    : undefined,
);

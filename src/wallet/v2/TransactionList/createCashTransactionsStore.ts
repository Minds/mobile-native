import type { WalletStoreType } from '../createWalletStore';
import type UserStore from '../../../auth/UserStore';
import type {
  SectionListEntities,
  ExtendedEntity,
  ListFiltersType,
} from './TransactionsListTypes';
import api from '../../../common/services/api.service';
import groupBy from '../../../common/helpers/groupBy';
import UserModel from '../../../channel/UserModel';
import moment from 'moment';

type ParamsType = {
  wallet: WalletStoreType;
  user: UserStore;
};

const createCashTransactionsStore = ({ wallet, user }: ParamsType) => {
  return {
    loading: true,
    refreshing: false,
    entities: <Array<ExtendedEntity>>[],
    filters: <ListFiltersType>{
      transactionType: 'all',
      dateRange: {
        none: true,
        from: moment().subtract(1, 'month').toDate(),
        to: moment().endOf('day').toDate(),
      },
    },
    get list(): Array<SectionListEntities> {
      const list = groupBy(this.entities, 'date');
      return Object.keys(list).map((v) => ({
        title: v,
        data: list[v],
      }));
    },
    setLoading(value: boolean) {
      this.loading = value;
    },
    setEntities(value: Array<any>) {
      value.forEach((tx) => {
        tx.superType = tx.type;
        tx.amount = tx.net / 100;
        const txMoment = moment(tx.timestamp * 1000).local();
        tx.date = txMoment.format('ddd MMM Do');
        tx.delta = this.getDelta(tx);
        tx.otherUser =
          tx.superType.includes('wire') && tx.customer_user
            ? this.getUser(tx)
            : null;
      });

      this.entities = value;
      this.loading = false;
    },
    async load() {
      this.setLoading(true);
      // api.abort(this);
      const result = await api.get<any>(
        'api/v2/payments/stripe/transactions',
        {},
        this,
      );

      this.setEntities(result.transactions);
    },
    getDelta(tx) {
      let delta = 'neutral';
      if (tx.type !== 'payout') {
        delta = tx.net < 0 ? 'negative' : 'positive';
      }
      return delta;
    },
    getUser(tx: ExtendedEntity) {
      const isSender = true;
      const eUser = UserModel.checkOrCreate(tx.customer_user);
      return {
        avatar: eUser.getAvatarSource(),
        username: eUser.username,
        isSender,
      };
    },
    async refresh() {
      this.refreshing = true;
      await this.load();
      this.refreshing = false;
    },
  };
};

export default createCashTransactionsStore;

export type CashTransactionsListStoreType = ReturnType<
  typeof createCashTransactionsStore
>;

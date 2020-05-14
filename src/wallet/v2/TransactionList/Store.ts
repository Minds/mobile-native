import formatDate from '../../../common/helpers/date';
import groupBy from '../../../common/helpers/groupBy';
import type UserStore from '../../../auth/UserStore';
import UserModel from '../../../channel/UserModel';
import {
  SectionListEntities,
  ExtendedEntity,
  deltaType,
  ListFiltersType,
} from './types';
import { WalletStoreType as WalletStore } from '../createWalletStore';
import toFriendlyCrypto from '../../../common/helpers/toFriendlyCrypto';

const createTransactionsListStore = ({ wallet, user }) => {
  const store = {
    wallet: wallet as WalletStore,
    user: user as UserStore,
    loading: true,
    loaded: false,
    list: [] as Array<SectionListEntities>,
    refreshing: false,
    runningTotal: 0,
    previousTxAmount: 0,
    filters: {} as ListFiltersType,
    setFilters(filters: ListFiltersType) {
      this.filters = filters;
      this.refresh();
    },
    get listFilters() {
      return this.filters;
    },
    async initialLoad() {
      this.runningTotal = wallet.balance;

      this.wallet.ledger.setMode('transactions');
      this.wallet.ledger.list.clearList();

      const end = new Date();
      const start = new Date();
      end.setHours(23, 59, 59);
      start.setMonth(start.getMonth() - 6);
      start.setHours(0, 0, 0);

      this.filters = {
        dateRange: {
          none: false,
          from: start,
          to: end,
        },
        transactionType: 'all',
      };

      this.loadMore();

      this.loaded = true;
    },
    setLoadin(loading) {
      this.loading = loading;
    },
    async loadMore() {
      if (!this.wallet.ledger.list.cantLoadMore()) {
        const setList = this.setList;
        const ledger = this.wallet.ledger;
        this.wallet.ledger.loadTransactionsListAsync(this.filters, () =>
          setList(ledger.list.entities.slice(), false),
        );
      }
    },
    getUser(entity: ExtendedEntity) {
      const selfUsername = this.user.me.username,
        isSender =
          entity.sender.username.toLowerCase() !== selfUsername.toLowerCase(),
        user = UserModel.checkOrCreate(
          isSender ? entity.sender : entity.receiver,
        );
      return {
        avatar: user.getAvatarSource(),
        username: user.username,
        isSender,
      };
    },
    /**
     * Get String representing the change of overall amount
     * @param entity
     */
    getDelta(contract: string, amount: number): deltaType {
      let delta: deltaType = 'neutral';
      if (contract !== 'offchain:withdraw') {
        delta = amount < 0 ? 'negative' : 'positive';
      }
      return delta;
    },
    formatAmount(amount) {
      const formattedAmount = {
        total: amount,
        int: 0,
        frac: null,
      };

      const splitBalance = amount.toString().split('.');

      formattedAmount.int = splitBalance[0];
      if (splitBalance[1]) {
        formattedAmount.frac = splitBalance[1].slice(0, 3);
      }

      return formattedAmount;
    },
    /**
     * Set list by grouping first
     * @param entities
     */
    setList(entities: Array<ExtendedEntity>, refresh) {
      const filteredEntities = entities.filter((entity, i) => {
        if (entity.failed || entity.contract === 'withdraw') {
          return false;
        }
        entity.date = formatDate(entity.timestamp, 'nameDay');
        entity.otherUser = entity.contract.includes('wire')
          ? this.getUser(entity)
          : null;
        entity.delta = this.getDelta(entity.contract, entity.amount);

        const isWithdrawal = entity.contract.includes('withdraw');
        let txAmount = toFriendlyCrypto(entity.amount);
        if (isWithdrawal) {
          txAmount = Math.abs(txAmount);
        }

        entity.amount = txAmount;

        if (i !== 0 || !refresh) {
          this.runningTotal -= this.previousTxAmount;
          this.previousTxAmount = isWithdrawal ? 0 : entity.amount;
        }
        entity.runningTotal = this.formatAmount(this.runningTotal);

        return true;
      });
      const list = groupBy(filteredEntities, 'date');
      Object.keys(list).forEach((v) => {
        this.list.push({
          title: v,
          data: list[v],
        });
      });
      this.loading = false;
    },
    refresh() {
      this.refreshing = true;
      this.list = [];
      const setList = this.setList;
      const ledger = this.wallet.ledger;
      this.wallet.ledger.refreshTransactionsList(this.filters, () =>
        setList(ledger.list.entities.slice(), true),
      );
    },
  };

  return store;
};

export default createTransactionsListStore;

export type TransactionsListStoreType = ReturnType<
  typeof createTransactionsListStore
>;

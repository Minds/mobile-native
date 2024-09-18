import moment from 'moment-timezone';

import groupBy from '~/common/helpers/groupBy';
import type UserStore from '~/auth/UserStore';
import UserModel from '~/channel/UserModel';
import {
  SectionListEntities,
  ExtendedEntity,
  deltaType,
  ListFiltersType,
  transactionTypes,
} from './TransactionsListTypes';
import type { WalletStoreType } from '../createWalletStore';
import toFriendlyCrypto from '~/common/helpers/toFriendlyCrypto';
import TokensStore from '../../tokens/TokensStore';
import sp from '~/services/serviceProvider';

type ParamsType = {
  wallet: WalletStoreType;
  user: UserStore;
};

const createTokensTransactionsStore = ({ wallet, user }: ParamsType) => {
  const i18n = sp.i18n;
  let runningTotal = 0,
    previousTxAmount = 0;
  const store = {
    user: user as UserStore,
    /**
     * Keep transaction history
     */
    ledger: new TokensStore(),
    filters: <ListFiltersType>{
      transactionType: 'all',
      dateRange: {
        none: true,
        from: moment().subtract(1, 'month').toDate(),
        to: moment().endOf('day').toDate(),
      },
    },
    setTransactionType(transactionType: transactionTypes) {
      this.filters.transactionType = transactionType;
      this.refresh();
    },
    get list(): Array<SectionListEntities> {
      // set runningTotal same value as balance
      runningTotal = wallet.balance;
      const filteredEntities = this.ledger.list.entities.filter(
        (entity: any, i) => {
          if (entity.failed || entity.contract === 'withdraw') {
            return false;
          }
          if (!entity.formatted) {
            entity.txMoment = moment(entity.timestamp * 1000).local();
            entity.displayTime = entity.txMoment.format('hh:mm a');
            entity.date = i18n.date(entity.txMoment, 'nameDay');
            entity.otherUser =
              entity.contract.includes('wire') ||
              entity.contract.includes('supermind')
                ? this.getUser(entity)
                : null;
            entity.delta = this.getDelta(entity.contract, entity.amount);

            const isWithdrawal = entity.contract.includes('withdraw');

            let txAmount = toFriendlyCrypto(entity.amount);
            if (isWithdrawal) {
              txAmount = Math.abs(txAmount);
            }

            entity.amount = txAmount;
            entity.formatted = true;
            entity.superType =
              entity.contract.indexOf('offchain:') === -1
                ? entity.contract
                : entity.contract.substr(9);

            if (i !== 0) {
              runningTotal -= previousTxAmount;
            }
            previousTxAmount = isWithdrawal ? 0 : entity.amount;
            entity.runningTotal = this.formatAmount(runningTotal);
          }

          return true;
        },
      );
      const list = groupBy(filteredEntities, 'date');
      return Object.keys(list).map(v => ({
        title: v,
        data: list[v],
      }));
    },
    async initialLoad() {
      runningTotal = wallet.balance;

      this.ledger.setMode('transactions');
      this.ledger.list.clearList();

      this.loadMore();
    },
    async loadMore() {
      if (!this.ledger.list.cantLoadMore()) {
        this.ledger.loadTransactionsListAsync(this.filters);
      }
    },
    getUser(entity: ExtendedEntity) {
      const selfUsername = this.user.me.username,
        isSender =
          entity.sender?.username.toLowerCase() !== selfUsername.toLowerCase(),
        eUser = UserModel.checkOrCreate(
          isSender ? entity.sender : entity.receiver,
        );
      return {
        avatar: eUser.getAvatarSource(),
        username: eUser.username,
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
    refresh() {
      this.ledger.refreshTransactionsList(this.filters);
    },
  };

  return store;
};

export default createTokensTransactionsStore;

export type TokensTransactionsListStoreType = ReturnType<
  typeof createTokensTransactionsStore
>;

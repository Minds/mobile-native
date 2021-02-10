import i18n from '../../../../common/services/i18n.service';
import validatorService from '../../../../common/services/validator.service';
import logService from '../../../../common/services/log.service';
import api from '../../../../common/services/api.service';
import BlockchainWithdrawService from '../../../../blockchain/v2/services/BlockchainWithdrawService';
import { UserError } from '../../../../common/UserError';
import sessionService from '../../../../common/services/session.service';
import type { WalletStoreType } from '../../createWalletStore';
import type { BottomOptionsStoreType } from '../../../../common/components/BottomOptionPopup';
import type { WCStore } from '../../../../blockchain/v2/walletconnect/WalletConnectContext';

const createWithdrawStore = (p: {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  wc: WCStore;
}) => {
  const store = {
    amount: p.walletStore.wallet.offchain.balance.toString(),
    accept: false,
    canTransfer: true,
    inProgress: true,
    // computed observable
    setCanTransfer(value: boolean) {
      this.inProgress = false;
      this.canTransfer = value;
    },
    toggleAccept() {
      this.accept = !this.accept;
    },
    init() {
      this.getCanTransfer().then((v) => this.setCanTransfer(v));
      p.bottomStore.setOnPressDone(async () => {
        if (!this.accept) {
          throw new UserError(i18n.t('auth.termsAcceptedError'), 'info');
        }
        if (this.error || !this.canTransfer || this.inProgress) {
          return;
        }
        try {
          await this.withdraw();
          p.bottomStore.hide();
        } catch (err) {
          logService.exception(err);
        }
      });
    },
    setInProgress(value: boolean) {
      this.inProgress = value;
    },
    get error(): string {
      const v = parseFloat(this.amount);
      if (v <= 0) {
        return i18n.t('wallet.withdraw.errorAmountNegative');
      } else if (v > p.walletStore.wallet.offchain.balance) {
        return i18n.t('wallet.withdraw.errorAmountToHigh');
      }
      return '';
    },
    async getCanTransfer(): Promise<boolean> {
      try {
        const response: any = await api.post(
          'api/v2/blockchain/transactions/can-withdraw',
        );
        if (!response) {
          return false;
        }
        return response.canWithdraw;
      } catch (e) {
        logService.exception(e);
        return false;
      }
    },
    setAmount(value: string) {
      if (validatorService.number(value)) {
        this.amount = value;
      }
    },
    async withdraw() {
      this.setInProgress(true);
      try {
        if (!(await this.getCanTransfer())) {
          throw new Error(i18n.t('wallet.withdraw.errorOnlyOnceDay'));
        }

        await p.wc.connect();

        if (!p.wc.web3 || !p.wc.connected || !p.wc.address) {
          throw new Error('You must connect the wallet first');
        }

        const withdrawService = new BlockchainWithdrawService(p.wc.web3, p.wc);

        const txResponse = await withdrawService.request(
          sessionService.guid!,
          parseFloat(this.amount),
          p.wc.address,
        );
        const response = await api.post<any>(
          'api/v2/blockchain/transactions/withdraw',
          {
            guid: sessionService.guid,
            ...txResponse,
          },
        );

        return response && response.entity;
      } catch (err) {
        if (err.message !== 'E_CANCELLED') {
          const error =
            err.message || i18n.t('wallet.withdraw.errorWithdrawing');
          throw new UserError(error, 'warning');
        }
      } finally {
        this.setInProgress(false);
      }
    },
  };

  // get can transfer async
  return store;
};

export default createWithdrawStore;

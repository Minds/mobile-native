import i18n from '../../../../../common/services/i18n.service';
import validatorService from '../../../../../common/services/validator.service';
import logService from '../../../../../common/services/log.service';
import api from '../../../../../common/services/api.service';
import BlockchainWithdrawService from '../../../../../blockchain/v2/services/BlockchainWithdrawService';
import sessionService from '../../../../../common/services/session.service';
import type { WalletStoreType } from '../../../../v2/createWalletStore';
import type { WCStore } from '../../../../../blockchain/v2/walletconnect/WalletConnectContext';
import { showNotification } from '../../../../../../AppMessages';

const createWithdrawStore = (p: {
  walletStore: WalletStoreType;
  wc: WCStore;
  navigation: any;
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
    async onPressTransfer() {
      if (this.hasError() || !this.canTransfer || this.inProgress) {
        return;
      }
      try {
        await this.withdraw();
        p.navigation.goBack();
      } catch (err) {
        logService.exception(err);
      }
    },
    init() {
      this.getCanTransfer().then(v => this.setCanTransfer(v));
    },
    setInProgress(value: boolean) {
      this.inProgress = value;
    },
    hasError(): boolean {
      const v = parseFloat(this.amount);
      if (v <= 0) {
        showNotification(
          i18n.t('wallet.withdraw.errorAmountNegative'),
          'danger',
        );
        return true;
      } else if (v > p.walletStore.wallet.offchain.balance) {
        showNotification(i18n.t('wallet.withdraw.errorAmountToHigh'), 'danger');
        return true;
      }
      return false;
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
        if (err instanceof Error && err.message !== 'E_CANCELLED') {
          const error =
            err.message || i18n.t('wallet.withdraw.errorWithdrawing');
          showNotification(error, 'warning');
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

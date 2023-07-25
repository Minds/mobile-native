import { observer } from 'mobx-react';
import { B1, B2, Column, Screen, ScreenHeader } from '~/common/ui';
import { GiftTransationList } from '../components/GiftTransactionList';
import { dateFormat } from '../components/date-utils';
import { useTranslation } from '../locales';

/**
 * CreditTransactions screen
 * calling from Wallet stack with params
 */
const CreditTransactionsScreen = observer(({ route }) => {
  const { expiresAt, guid } = route.params ?? {};
  const { t } = useTranslation();
  return (
    <Screen safe scroll>
      <ScreenHeader back title={t('Boost Credits')} />
      <Column left="XL">
        <B1 color="secondary" font="bold">
          Expires {dateFormat(expiresAt)}
        </B1>
        <B2 color="secondary" vertical="XL">
          {t('You can view all your transactions made with this gift.')}
        </B2>
      </Column>
      <GiftTransationList guid={guid} />
    </Screen>
  );
});

export default CreditTransactionsScreen;

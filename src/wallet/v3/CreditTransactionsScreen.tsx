import { observer } from 'mobx-react';
import { B1, B2, Column, Screen, ScreenHeader } from '~/common/ui';
import { GiftTransationList } from './currency-tabs/credit-lists/components/GiftTransactionList';
import { dateFormat } from './currency-tabs/credit-lists/components/date-utils';
// import i18n from '~/common/services/i18n.service';

/**
 * CreditTransactions screen
 */
const CreditTransactionsScreen = observer(({ route }) => {
  const { guid, expiresAt } = route.params ?? {};

  return (
    <Screen safe scroll>
      <ScreenHeader back title={'Boost Credits'} />
      <Column left="XL">
        <B1 color="secondary" font="bold">
          Expires {dateFormat(expiresAt)}
        </B1>
        <B2 color="secondary" vertical="XL">
          You can view all your transactions made with this gift.
        </B2>
      </Column>
      <GiftTransationList guid={guid} />
    </Screen>
  );
});

export default CreditTransactionsScreen;

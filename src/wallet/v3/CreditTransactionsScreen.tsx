import { observer } from 'mobx-react';
import {
  B1,
  B2,
  B3,
  Column,
  IIcon,
  Icon,
  // IconButton,
  Row,
  Screen,
  ScreenHeader,
} from '~/common/ui';
import { useGiftCardTransactionsQuery } from '~/graphql/api';
// import i18n from '~/common/services/i18n.service';

/**
 * CreditTransactions screen
 */
const CreditTransactionsScreen = observer(({ route }) => {
  const { guid } = route.params ?? {};
  console.log('WalletStackParamList', guid);

  const { data: transactions } = useGiftCardTransactionsQuery({
    guid,
    first: 12,
  });
  console.log('transactions', transactions);

  return (
    <Screen safe scroll>
      <ScreenHeader back title={'Boost Credits'} />
      <Column left="XL">
        <B1 color="secondary" font="bold">
          Expires Apr 18, 2024
        </B1>
        <B2 color="secondary" top="XL">
          You can view all your transactions made with this gift.
        </B2>
      </Column>
      {renderItem()}
      {renderItem()}
    </Screen>
  );
});

const renderItem = () => {
  return (
    <Column horizontal="XL" vertical="L">
      <B1 color="secondary">Sat Apr 18th </B1>
      <Row flex top="L" align="centerBetween" background="secondary">
        <Row flex align="centerStart" background="tertiary">
          <Icon name="boost" />
          <Column flex left="M">
            {/* <B1>Credit towards Boosted Content</B1> */}
            <B1>Boost Credit from @minds (Expires Apr 18th)</B1>
            <B3 color="secondary">08:15</B3>
          </Column>
        </Row>
        <Row align="centerBoth">
          <Icon {...indicatorProps.down} />
          <B1 font="bold" color="primary">
            10
          </B1>
        </Row>
      </Row>
    </Column>
  );
};

const indicatorProps: Record<string, IIcon> = {
  up: {
    name: 'triangle-up',
    color: 'SuccessBackground',
  },
  down: {
    name: 'triangle-down',
    color: 'DangerBackground',
  },
};

export default CreditTransactionsScreen;

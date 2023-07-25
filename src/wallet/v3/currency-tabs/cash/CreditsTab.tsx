import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { B1, B3, Column, H4, Screen } from '~ui';
import i18n from '~/common/services/i18n.service';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '~/common/components/topbar-tabbar/TopBarButtonTabBar';
import moment from 'moment';
import {
  GiftCardList,
  useGetGiftBalance,
  useGetGiftCards,
} from '../credit-lists/components/GiftCardList';

type CreditOptions = 'balance';
/**
 * Credits tab
 */
const CreditsTab = observer(() => {
  const [option, setOption] = useState<CreditOptions>('balance');
  const options: Array<ButtonTabType<CreditOptions>> = [
    { id: 'balance', title: 'Gift Balance' },
  ];

  const tabs: Record<CreditOptions, React.ReactElement> = {
    balance: <GiftCardList />,
  };

  const balance = useGetGiftBalance();

  const { data } = useGetGiftCards();

  const firstNode = data?.[0]?.node ?? {};
  const { balance: bal, expiresAt: exp } = firstNode;

  return (
    <Screen>
      <Column horizontal="XL" vertical="L">
        <B1 color="secondary">{i18n.t('wallet.credits.title')}</B1>
        <H4>${balance}</H4>
        {bal && exp ? (
          <B3 top="S">
            ${bal} in Boost Credits{'\n'}Expires {dateFormat(exp)}
          </B3>
        ) : undefined}
      </Column>
      <TopBarButtonTabBar
        tabs={options}
        current={option}
        onChange={setOption}
      />
      {tabs[option]}
    </Screen>
  );
});

const dateFormat = (val: number) => moment(val * 1000).format('ddd MMM do');

export default CreditsTab;

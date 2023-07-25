import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { B1, B3, Column, H4, Screen } from '~ui';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '~/common/components/topbar-tabbar/TopBarButtonTabBar';
import {
  GiftCardList,
  useGetGiftBalance,
  useGetGiftCards,
} from './GiftCardList';
import { dateFormat } from './date-utils';

type CreditOptions = 'balance';
/**
 * Credits tab
 */
const CreditsTab = observer(() => {
  const [option, setOption] = useState<CreditOptions>('balance');

  const balance = useGetGiftBalance();
  const { data } = useGetGiftCards();

  const firstNode = data?.[0]?.node ?? {};
  const { balance: bal, expiresAt: exp } = firstNode;

  const options: Array<ButtonTabType<CreditOptions>> = [
    { id: 'balance', title: 'Gift Balance' },
  ];
  const tabs: Record<CreditOptions, React.ReactElement> = {
    balance: <GiftCardList />,
  };

  return (
    <Screen>
      <Column horizontal="XL" vertical="L">
        <B1 color="secondary">{'Boost Credits'}</B1>
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

export default CreditsTab;

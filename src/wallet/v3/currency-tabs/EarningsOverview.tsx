import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  EarningsCurrencyType,
  WalletStoreType,
} from '../../v2/createWalletStore';
import { TokensEarningsStore } from './TokensEarnings';
import { ScrollView } from 'react-native-gesture-handler';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../common/components/AccordionSet';
import MindsTokens, { format } from './MindsTokens';
import { Earnings } from '../../v2/WalletTypes';
import AccordionContent, { AccordionContentData } from './AccordionContent';
import AccordionHeader from './AccordionHeader';
import ThemedStyles from '../../../styles/ThemedStyles';
import CenteredLoading from '../../../common/components/CenteredLoading';
import capitalize from '../../../common/helpers/capitalize';

type PropsType = {
  localStore: TokensEarningsStore;
  walletStore: WalletStoreType;
  currencyType: EarningsCurrencyType;
};

export const getFriendlyLabel = (id: string): string => {
  switch (id) {
    case 'wire':
      return 'Minds Pay';
    case 'wire-all':
      return 'Memberships & Tips';
    case 'partner':
      return 'Revenue Share';
    case 'plus':
      return 'Minds+ Content';
    case 'wire_referral':
      return 'Minds Pay Commissions';
  }

  return capitalize(id);
};

const getProcessedData = (earning: Earnings): AccordionContentData[] =>
  earning.items.map((data) => ({
    title: getFriendlyLabel(data.id),
    info: `${format(data.amount_usd)} MINDS`,
  }));

const renderHeader = (content: AccordionDataType, index, isActive) => (
  <AccordionHeader
    title={content.title}
    subtitle={content.subtitle}
    tooltip={content.tooltip}
    isActive={isActive}
  />
);

const ContentComponent: RenderFunction = (content: AccordionDataType) =>
  content.children;

const EarningsOverview = observer(
  ({ localStore, walletStore, currencyType }: PropsType) => {
    const theme = ThemedStyles.style;
    useEffect(() => {
      localStore.loadEarnings(localStore.selectedDate);
    }, [localStore, localStore.selectedDate, walletStore]);

    if (localStore.loading) {
      return <CenteredLoading />;
    }
    const accordionData: Array<AccordionDataType> = walletStore.usdEarnings.map(
      (earning) => ({
        title: getFriendlyLabel(earning.id),
        subtitle: (
          <MindsTokens
            minds={(
              earning.amount_usd / parseFloat(walletStore.prices.minds)
            ).toString()}
            mindsPrice={walletStore.prices.minds}
            currencyType={currencyType}
          />
        ),
        children: <AccordionContent data={getProcessedData(earning)} />,
      }),
    );
    return (
      <ScrollView contentContainerStyle={theme.paddingTop4x}>
        <AccordionSet
          data={accordionData}
          headerComponent={renderHeader}
          contentComponent={ContentComponent}
        />
      </ScrollView>
    );
  },
);

export default EarningsOverview;

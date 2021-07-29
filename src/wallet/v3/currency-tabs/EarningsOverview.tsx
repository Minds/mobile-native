import { observer } from 'mobx-react';
import React from 'react';
import {
  EarningsCurrencyType,
  WalletStoreType,
} from '../../v2/createWalletStore';
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
import toFriendlyCrypto from '../../../common/helpers/toFriendlyCrypto';
import { TokensTabStore } from './tokens/createTokensTabStore';
import sessionService from '../../../common/services/session.service';
import AccordionHeaderTitle from './AccordionHeaderTitle';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  localStore: TokensTabStore;
  walletStore: WalletStoreType;
  currencyType: EarningsCurrencyType;
};

export const getFriendlyLabel = (id: string): string => {
  switch (id) {
    case 'wire':
      return i18n.t('wallet.wire');
    case 'wire-all':
      return i18n.t('wallet.wireAll');
    case 'partner':
      return i18n.t('wallet.partner');
    case 'plus':
      return i18n.t('wallet.plus');
    case 'wire_referral':
      return i18n.t('wallet.wireReferral');
  }

  return capitalize(id);
};

const getProcessedData = (
  earning: Earnings,
  currencyType: EarningsCurrencyType,
): AccordionContentData[] =>
  earning.items.map(data => {
    const isTokens = !currencyType || currencyType === 'tokens';
    const value = isTokens
      ? toFriendlyCrypto(data.amount_tokens)
      : data.amount_usd;
    const formattedValue = value ? format(value) : 0;
    return {
      title: getFriendlyLabel(data.id),
      info: `${isTokens ? '' : '$'}${formattedValue} ${
        isTokens ? 'tokens' : ''
      }`,
    };
  });

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

    if (localStore.loading) {
      return <CenteredLoading />;
    }
    const accordionData: Array<AccordionDataType> = walletStore.usdEarnings
      .filter(earning => {
        if (earning.id === null) {
          return false;
        }

        if (earning.id !== 'partner') {
          return true;
        }

        const user = sessionService.getUser();

        if (
          currencyType === 'usd' &&
          ((user.pro && user.pro_method === 'tokens') ||
            (user.plus && user.plus_method === 'tokens'))
        ) {
          return false;
        }

        if (
          currencyType === 'tokens' &&
          ((user.pro && user.pro_method === 'usd') ||
            (user.plus && user.plus_method === 'usd'))
        ) {
          return false;
        }

        return true;
      })
      .map(earning => {
        const value =
          currencyType === 'tokens'
            ? toFriendlyCrypto(earning.amount_tokens) || 0
            : earning.amount_usd > 0
            ? earning.amount_usd
            : 0;
        return {
          title: <AccordionHeaderTitle earningId={earning.id} />,
          subtitle: (
            <MindsTokens
              value={value.toString()}
              mindsPrice={walletStore.prices.minds}
              currencyType={currencyType}
            />
          ),
          children: (
            <AccordionContent data={getProcessedData(earning, currencyType)} />
          ),
        };
      });
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

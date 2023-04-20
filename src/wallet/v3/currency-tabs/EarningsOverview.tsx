import { observer } from 'mobx-react';
import React from 'react';
import {
  EarningsCurrencyType,
  WalletStoreType,
} from '../../v2/createWalletStore';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../common/components/AccordionSet';
import MindsTokens, { format } from './MindsTokens';
import { Earnings } from '../../v2/WalletTypes';
import AccordionContent, { AccordionContentData } from './AccordionContent';
import AccordionHeader from './AccordionHeader';
import CenteredLoading from '../../../common/components/CenteredLoading';
import capitalize from '../../../common/helpers/capitalize';
import toFriendlyCrypto from '../../../common/helpers/toFriendlyCrypto';
import { TokensTabStore } from './tokens/createTokensTabStore';
import AccordionHeaderTitle from './AccordionHeaderTitle';
import i18n from '../../../common/services/i18n.service';
import { Spacer } from '~ui';

type PropsType = {
  localStore: TokensTabStore;
  walletStore: WalletStoreType;
  currencyType: EarningsCurrencyType;
};

const friendlyLabel = {
  wire: i18n.t('wallet.wire'),
  'wire-all': i18n.t('wallet.wireAll'),
  partner: i18n.t('wallet.partner'),
  plus: i18n.t('wallet.plus'),
  wire_referral: i18n.t('wallet.wireReferral'),
  boost_partner: i18n.t('wallet.boostPartner'),
};
export const getFriendlyLabel = (id: string): string =>
  friendlyLabel[id] ?? capitalize(id);

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
    if (localStore.loading) {
      return <CenteredLoading />;
    }
    const accordionData: Array<AccordionDataType> = walletStore.usdEarnings
      .filter(earning => !!earning.id)
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
      <Spacer vertical="S">
        <AccordionSet
          data={accordionData}
          headerComponent={renderHeader}
          contentComponent={ContentComponent}
        />
      </Spacer>
    );
  },
);

export default EarningsOverview;

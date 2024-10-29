import { observer } from 'mobx-react';
import React from 'react';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../../common/components/AccordionSet';
import AccordionHeader from '../AccordionHeader';
import MindsTokens, { format } from '../MindsTokens';
import AccordionContent, { AccordionContentData } from '../AccordionContent';
import EngagementSummary from './EngagementSummary';
import HoldingSummary from './HoldingSummary';
import LiquiditySummary from './LiquiditySummary';
import { PricesType } from '../../../v2/createWalletStore';
import { Reward, TokensTabStore } from './createTokensTabStore';
import { Spacer } from '~ui';
import MText from '~/common/components/MText';

import sp from '~/services/serviceProvider';

type PropsType = {
  store: TokensTabStore;
  prices: PricesType;
};
const getProcessedData = (data: Reward): AccordionContentData[] => [
  {
    title: sp.i18n.t('wallet.yourScore'),
    info: `${format(data.score, false)} points`,
    tooltip: {
      title: sp.i18n.t(`wallet.tokens.tooltips.${data.reward_type}Score`),
      width: 200,
      height: 80,
    },
  },
  {
    title: sp.i18n.t('wallet.networkScore'),
    info: `${format(data.global_summary.score, false)} points`,
    tooltip: {
      title: sp.i18n.t(`wallet.tokens.tooltips.${data.reward_type}Total`),
      width: 200,
      height: 80,
    },
  },
  {
    title: sp.i18n.t('wallet.yourShare'),
    info: `${format(data.share_pct * 100)}%`,
    tooltip: {
      title: sp.i18n.t(`wallet.tokens.tooltips.${data.reward_type}Percentage`),
      width: 200,
      height: 80,
    },
  },
  {
    title: sp.i18n.t('wallet.rewards', { count: 1 }),
    info: `${format(parseFloat(data.token_amount))} (${format(
      data.share_pct * 100,
    )}% of ${format(parseFloat(data.global_summary.token_amount))})`,
    tooltip: {
      title: sp.i18n.t(`wallet.tokens.tooltips.${data.reward_type}Reward`),
      width: 200,
      height: 80,
    },
  },
];

const Summary = (props: any) => {
  switch (props.reward.reward_type) {
    case 'engagement':
      return (
        <EngagementSummary
          contributionScores={props.contributionScores}
          reward={props.reward}
        />
      );
    case 'holding':
      return <HoldingSummary reward={props.reward} />;
    case 'liquidity':
      return (
        <LiquiditySummary
          liquidityPositions={props.liquidityPositions}
          reward={props.reward}
        />
      );
    default:
      return <></>;
  }
};

const renderHeader = (content: AccordionDataType, index, isActive) => (
  <AccordionHeader
    title={content.title}
    subtitle={content.subtitle}
    tooltip={content.tooltip}
    isActive={isActive}
  />
);

const renderFooter = ({ footer }: AccordionDataType) =>
  footer ? <MText style={styles.footerText}>{footer}</MText> : <></>;

const ContentComponent: RenderFunction = (content: AccordionDataType) =>
  content.children;

const MindsScores = observer(({ store, prices }: PropsType) => {
  const scores = [
    store.rewards.engagement,
    store.rewards.holding,
    store.rewards.liquidity,
  ];

  const accordionData: Array<AccordionDataType> = scores.map(reward => ({
    title: sp.i18n.t(`wallet.${reward.reward_type}`),
    subtitle:
      reward.reward_type === 'holding' ? (
        ''
      ) : (
        <MindsTokens value={reward.token_amount} mindsPrice={prices.minds} />
      ),
    children: (
      <AccordionContent
        data={getProcessedData(reward)}
        summary={
          <Summary
            reward={reward}
            contributionScores={store.contributionScores}
            liquidityPositions={store.liquidityPositions}
          />
        }
      />
    ),
    tooltip: {
      title: sp.i18n.t(`wallet.tokens.tooltips.${reward.reward_type}`),
      width: 200,
      height: 80,
    },
    footer:
      reward.reward_type === 'holding'
        ? sp.i18n.t(`wallet.tokens.footers.${reward.reward_type}`)
        : undefined,
  }));

  return (
    <Spacer vertical="S">
      <AccordionSet
        data={accordionData}
        headerComponent={renderHeader}
        contentComponent={ContentComponent}
        footerComponent={renderFooter}
      />
    </Spacer>
  );
});

const styles = sp.styles.create({
  footerText: [
    'colorSecondaryText',
    'marginLeft4x',
    'marginBottom5x',
    {
      fontSize: 13,
      lineHeight: 16,
    },
  ],
});

export default MindsScores;

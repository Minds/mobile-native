import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../../common/components/AccordionSet';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import AccordionHeader from '../AccordionHeader';
import { Reward, TokensRewardsStore } from './TokensRewards';
import MindsTokens, { format } from '../MindsTokens';
import AccordionContent, { AccordionContentData } from '../AccordionContent';
import EngagementSummary from './EngagementSummary';
import HoldingSummary from './HoldingSummary';
import LiquiditySummary from './LiquiditySummary';
import { PricesType } from '../../../v2/createWalletStore';

type PropsType = {
  store: TokensRewardsStore;
  prices: PricesType;
};

const getProcessedData = (data: Reward): AccordionContentData[] => [
  {
    title: 'Your Score',
    info: `${format(data.score, false)} points`,
    tooltip: {
      title: i18n.t(`wallet.tokens.tooltips.${data.reward_type}Score`),
      width: 200,
      height: 80,
    },
  },
  {
    title: 'Network score',
    info: `${format(data.global_summary.score, false)} points`,
    tooltip: {
      title: i18n.t(`wallet.tokens.tooltips.${data.reward_type}Total`),
      width: 200,
      height: 80,
    },
  },
  {
    title: 'Your share',
    info: `${format(data.share_pct * 100)}%`,
    tooltip: {
      title: i18n.t(`wallet.tokens.tooltips.${data.reward_type}Percentage`),
      width: 200,
      height: 80,
    },
  },
  {
    title: 'Reward',
    info: `${format(parseFloat(data.token_amount))} (${format(
      data.share_pct * 100,
    )}% of ${format(parseFloat(data.global_summary.token_amount))})`,
    tooltip: {
      title: i18n.t(`wallet.tokens.tooltips.${data.reward_type}Reward`),
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

const ContentComponent: RenderFunction = (content: AccordionDataType) =>
  content.children;

const MindsScores = observer(({ store, prices }: PropsType) => {
  const theme = ThemedStyles.style;
  const scores = [
    store.rewards.engagement,
    store.rewards.holding,
    store.rewards.liquidity,
  ];
  const accordionData: Array<AccordionDataType> = scores.map((reward) => ({
    title: i18n.t(`wallet.${reward.reward_type}`),
    subtitle: (
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
      title: i18n.t(`wallet.tokens.tooltips.${reward.reward_type}`),
      width: 200,
      height: 80,
    },
  }));

  return (
    <ScrollView contentContainerStyle={theme.paddingTop4x}>
      <AccordionSet
        data={accordionData}
        headerComponent={renderHeader}
        contentComponent={ContentComponent}
      />
    </ScrollView>
  );
});

export default MindsScores;

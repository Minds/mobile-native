import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../common/components/AccordionSet';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import AccordionHeader from './AccordionHeader';
import { TokensEarningsStore } from './TokensEarnings';
import MindsTokens from './MindsTokens';
import AccordionContent from './AccordionContent';
import EngagementSummary from './EngagementSummary';
import HoldingSummary from './HoldingSummary';
import LiquiditySummary from './LiquiditySummary';

type PropsType = {
  store: TokensEarningsStore;
};

const Sumary = (props: any) => {
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

const MindsScores = observer(({ store }: PropsType) => {
  const theme = ThemedStyles.style;
  const scores = [
    store.rewards.engagement,
    store.rewards.holding,
    store.rewards.liquidity,
  ];
  const accordionData: Array<AccordionDataType> = scores.map((reward) => ({
    title: i18n.t(`wallet.${reward.reward_type}`),
    subtitle: (
      <MindsTokens
        minds={reward.token_amount}
        mindsPrice={store.prices.minds}
      />
    ),
    children: (
      <AccordionContent
        data={reward}
        summary={
          <Sumary
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

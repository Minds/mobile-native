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

type PropsType = {
  store: TokensEarningsStore;
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
        minds={reward.token_amount.substring(0, 5)}
        mindsPrice={store.prices.minds}
      />
    ),
    children: <AccordionContent data={reward} type={'minds'} />,
    tooltip: {
      title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
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

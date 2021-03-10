import React from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { Text } from 'react-native';
import { ContributionMetric } from '../../../v2/createWalletStore';
import { format } from '../MindsTokens';
import { Container, Info, Row, Title } from '../AccordionContent';
import { Reward } from './TokensRewards';
import ActivityMultiplier from './multipliers/ActivityMultiplier';

type PropsType = {
  contributionScores: ContributionMetric[];
  reward: Reward;
};

const ContributionScores = ({ metric }: { metric: ContributionMetric }) => {
  const theme = ThemedStyles.style;
  return (
    <Container>
      <Row>
        <Title>{metric.label}</Title>
      </Row>
      <Row>
        <Title style={theme.width25}>{format(metric.amount, false)}</Title>
        <Info style={[theme.bold, theme.width75]}>
          {format(metric.score, false)}{' '}
          <Text style={[theme.colorSecondaryText]}>points</Text>
        </Info>
      </Row>
    </Container>
  );
};

const EngagementSummary = ({ contributionScores, reward }: PropsType) => {
  const theme = ThemedStyles.style;
  const metrics = contributionScores.map((metric) => (
    <ContributionScores metric={metric} />
  ));

  return (
    <>
      {metrics}
      <Container style={contributionScores.length ? theme.marginTop4x : {}}>
        <Row>
          <Title>Total Points</Title>
        </Row>
        <Row>
          <Info>{format(reward.score, false)} </Info>
          <Title>
            points ({parseFloat(reward.score) / reward.multiplier} x{' '}
            {reward.multiplier})
          </Title>
        </Row>
      </Container>
      <Container>
        <Row>
          <Title>Activity Multiplier</Title>
        </Row>
        <Row>
          <ActivityMultiplier activityLevel={parseInt(reward.multiplier)} />
        </Row>
      </Container>
    </>
  );
};

export default EngagementSummary;

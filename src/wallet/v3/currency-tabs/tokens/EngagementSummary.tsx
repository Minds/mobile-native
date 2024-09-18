import React from 'react';

import { ContributionMetric } from '../../../v2/createWalletStore';
import { format } from '../MindsTokens';
import { Container, Info, Row, RowRight, Title } from '../AccordionContent';
import ActivityMultiplier from './multipliers/ActivityMultiplier';
import { SummaryLabel } from './LiquiditySummary';
import { Reward } from './createTokensTabStore';
import capitalize from '../../../../common/helpers/capitalize';
import sp from '~/services/serviceProvider';

type PropsType = {
  contributionScores: ContributionMetric[];
  reward: Reward;
};

const ContributionScores = ({ metric }: { metric: ContributionMetric }) => {
  return (
    <Container>
      <Row>
        <Title>{capitalize(metric.label)}</Title>
      </Row>
      <RowRight>
        <Title>{format(metric.amount, false)}</Title>
        <Info>
          {format(metric.score, false)} <Title>points</Title>
        </Info>
      </RowRight>
    </Container>
  );
};

const EngagementSummary = ({ contributionScores, reward }: PropsType) => {
  const theme = sp.styles.style;
  const metrics = contributionScores.map(metric => (
    <ContributionScores key={metric.id} metric={metric} />
  ));

  return (
    <>
      {metrics}
      <Container style={contributionScores.length ? theme.marginTop4x : {}}>
        <SummaryLabel>
          <Title>Total Points</Title>
        </SummaryLabel>
        <RowRight>
          <Info>
            {format(reward.score, false)}{' '}
            <Title>
              points ({parseFloat(reward.score) / reward.multiplier} x{' '}
              {reward.multiplier})
            </Title>
          </Info>
        </RowRight>
      </Container>
      <Container>
        <SummaryLabel>
          <Title>Activity Multiplier</Title>
        </SummaryLabel>
        <RowRight>
          <ActivityMultiplier multiplier={reward.multiplier} />
        </RowRight>
      </Container>
    </>
  );
};

export default EngagementSummary;

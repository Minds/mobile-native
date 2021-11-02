import React from 'react';
import { format } from '../MindsTokens';
import { Container, Info, RowRight, Title } from '../AccordionContent';
import TimeMultiplier from './multipliers/TimeMultiplier';
import { SummaryLabel } from './LiquiditySummary';
import { Reward } from './createTokensTabStore';

type PropsType = {
  reward: Reward;
};

const HoldingSummary = ({ reward }: PropsType) => {
  return (
    <>
      <Container>
        <SummaryLabel>
          <Title>OnChain Tokens</Title>
        </SummaryLabel>
        <RowRight>
          <Info>{format(reward.score, false)} </Info>
          <Title>tokens</Title>
        </RowRight>
      </Container>
      <Container>
        <SummaryLabel>
          <Title>Time multiplier</Title>
        </SummaryLabel>
        <RowRight>
          <TimeMultiplier multiplier={reward.multiplier} />
        </RowRight>
      </Container>
    </>
  );
};

export default HoldingSummary;

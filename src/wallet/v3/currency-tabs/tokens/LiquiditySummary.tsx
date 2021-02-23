import React from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View } from 'react-native';
import { Reward } from './TokensRewards';
import { format } from '../MindsTokens';
import { Container, Info, Row, Title } from '../AccordionContent';

type PropsType = {
  liquidityPositions: any;
  reward: Reward;
};

const LiquiditySummary = ({ liquidityPositions, reward }: PropsType) => {
  const theme = ThemedStyles.style;

  const progressBar = [
    { flex: 1, width: `${(reward.multiplier / 3) * 100}%` },
    theme.backgroundLink,
  ];

  return (
    <>
      <Container>
        <Row>
          <Title>Liquidity position</Title>
        </Row>
        <Row>
          <Info>
            {format(liquidityPositions?.current_liquidity?.MINDS, false)}{' '}
          </Info>
          <Title style={theme.marginLeft3x}>tokens / </Title>
          <Info>
            {format(liquidityPositions?.current_liquidity?.USD, false)}{' '}
          </Info>
          <Title>USD</Title>
        </Row>
      </Container>
      <Container>
        <Row>
          <Title>Time multiplier</Title>
        </Row>
        <Row>
          <Title style={theme.marginRight4x}>
            {format(reward.multiplier, false)}
          </Title>
          <View style={[theme.width70, theme.backgroundPrimary]}>
            <View style={progressBar} />
          </View>
        </Row>
      </Container>
    </>
  );
};

export default LiquiditySummary;

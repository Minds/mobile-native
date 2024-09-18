import React, { useEffect } from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { format } from '../MindsTokens';
import { Container, Info, Row, Title, RowRight } from '../AccordionContent';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import TimeMultiplier from './multipliers/TimeMultiplier';
import { Reward } from './createTokensTabStore';
import { B3 } from '~ui';
import sp from '~/services/serviceProvider';

type PropsType = {
  liquidityPositions: any;
  reward: Reward;
};

export const SummaryLabel = ({ children }) => <Row>{children}</Row>;

const LiquiditySummary = observer(
  ({ liquidityPositions, reward }: PropsType) => {
    const user = useCurrentUser();
    const isFocused = useIsFocused();

    const store = useLocalStore(() => ({
      hasOptedOutLiquiditySpot: user?.liquidity_spot_opt_out,
      setOptedOutLiquiditySpot(val) {
        store.hasOptedOutLiquiditySpot = Boolean(val);
      },
    }));

    useEffect(() => {
      store.setOptedOutLiquiditySpot(user?.liquidity_spot_opt_out);
    }, [user, isFocused, store]);

    const increase = liquidityPositions?.yield_liquidity?.USD > 0;

    const yieldLiquidity = parseFloat(liquidityPositions?.yield_liquidity?.USD);
    const providedLiquidity = parseFloat(
      liquidityPositions?.provided_liquidity?.USD,
    );

    const yieldLiquidityPrcnt =
      providedLiquidity !== 0 ? (yieldLiquidity / providedLiquidity) * 100 : 0;

    return (
      <>
        <Container>
          <SummaryLabel>
            <Title>Provided Liquidity</Title>
          </SummaryLabel>
          <RowRight>
            {/* Conditional added as providedLiquidity was returning NaN on my account @rcaferati */}
            {providedLiquidity ? (
              <Info>${format(providedLiquidity, false)}</Info>
            ) : null}
          </RowRight>
        </Container>
        <Container>
          <SummaryLabel>
            <Title>Liquidity position</Title>
          </SummaryLabel>
          <RowRight>
            {yieldLiquidity ? (
              <Info>
                ${format(liquidityPositions?.current_liquidity?.USD, false)}{' '}
                <Icon
                  name={`arrow-${increase ? 'up' : 'down'}`}
                  size={16}
                  color={increase ? '#59B814' : '#e03c20'}
                />{' '}
                ${format(yieldLiquidity, false)}
              </Info>
            ) : null}
          </RowRight>
        </Container>
        <Container>
          <SummaryLabel>
            <Title>Yield</Title>
          </SummaryLabel>
          <RowRight>
            {yieldLiquidityPrcnt ? (
              <Info>{format(yieldLiquidityPrcnt, false)}%</Info>
            ) : null}
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
        <Container>
          <Row>
            <B3
              top="S"
              color="link"
              onPress={() => sp.navigation.navigate('BoostSettingsScreen')}>
              {user?.liquidity_spot_opt_out ? 'Opt-in to' : 'Opt-out of'}{' '}
              showing in liquidity spot
            </B3>
          </Row>
        </Container>
      </>
    );
  },
);

export default LiquiditySummary;

import React, { useEffect } from 'react';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View } from 'react-native';
import { format } from '../MindsTokens';
import { Container, Info, Row, Title } from '../AccordionContent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useCurrentUser from '../../../../common/hooks/useCurrentUser';
import NavigationService from '../../../../navigation/NavigationService';
import { observer, useLocalStore } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import TimeMultiplier from './multipliers/TimeMultiplier';
import { Reward } from './createTokensTabStore';

type PropsType = {
  liquidityPositions: any;
  reward: Reward;
};

export const SummaryLabel = ({ style = {}, children }) => (
  <Row style={[{ marginRight: -25 }, style]}>{children}</Row>
);

const LiquiditySummary = observer(
  ({ liquidityPositions, reward }: PropsType) => {
    const theme = ThemedStyles.style;
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
          <Row>
            <Info>${format(providedLiquidity, false)} </Info>
          </Row>
        </Container>
        <Container>
          <SummaryLabel>
            <Title>Liquidity position</Title>
          </SummaryLabel>
          <Row>
            <Info>
              ${format(liquidityPositions?.current_liquidity?.USD, false)}{' '}
            </Info>
            <View style={[theme.rowJustifyStart, theme.centered]}>
              <Icon
                name={`arrow-${increase ? 'up' : 'down'}`}
                size={20}
                color={increase ? '#59B814' : '#e03c20'}
              />
              <Info style={theme.colorSecondaryText}>
                ${format(yieldLiquidity, false)}{' '}
              </Info>
            </View>
          </Row>
        </Container>
        <Container>
          <SummaryLabel>
            <Title>Yield</Title>
          </SummaryLabel>
          <Row>
            <Info>{format(yieldLiquidityPrcnt, false)}%</Info>
          </Row>
        </Container>
        <Container>
          <SummaryLabel>
            <Title>Time multiplier</Title>
          </SummaryLabel>
          <Row>
            <TimeMultiplier multiplier={reward.multiplier} />
          </Row>
        </Container>
        <Container>
          <Row>
            <TouchableOpacity
              onPress={() => NavigationService.navigate('BoostSettingsScreen')}
            >
              <Title style={theme.colorLink}>
                {user?.liquidity_spot_opt_out ? 'Opt-in to' : 'Opt-out of'}{' '}
                showing in liquidity spot
              </Title>
            </TouchableOpacity>
          </Row>
        </Container>
      </>
    );
  },
);

export default LiquiditySummary;

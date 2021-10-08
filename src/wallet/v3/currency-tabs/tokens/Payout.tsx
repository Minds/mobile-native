import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from '~ui/icons';
import MText from '../../../../common/components/MText';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MindsTokens from '../MindsTokens';
import { TokensTabStore } from './createTokensTabStore';

type PropsType = {
  minds: string;
  mindsPrice: string;
  isToday: boolean;
  store: TokensTabStore;
};

const Payout = ({ minds, mindsPrice, isToday, store }: PropsType) => {
  const theme = ThemedStyles.style;

  const refresh = (
    <IconButton
      onPress={() => store.loadRewards(store.rewardsSelectedDate)}
      name="refresh"
      size="small"
    />
  );

  const payout = isToday ? (
    <View style={[styles.container, theme.bcolorPrimaryBorder]}>
      <View style={styles.innerContainer}>
        <MText style={styles.text}>{i18n.t('wallet.todayEstimate')}</MText>
      </View>
      <MindsTokens
        value={minds}
        mindsPrice={mindsPrice}
        textStyles={[theme.centered, theme.flexContainer]}
      />
      {refresh}
    </View>
  ) : (
    <View style={[styles.container, theme.bcolorPrimaryBorder]}>
      <MText style={[styles.text, styles.innerContainer]}>
        {i18n.t('wallet.usd.earnings')}
      </MText>
      <MindsTokens
        value={minds}
        mindsPrice={mindsPrice}
        textStyles={theme.flexContainer}
      />
      {refresh}
    </View>
  );

  return payout;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginTop: 20,
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: 'Roboto-Medium',
  },
  innerContainer: {
    flex: 1,
    marginRight: 26,
  },
});

export default Payout;

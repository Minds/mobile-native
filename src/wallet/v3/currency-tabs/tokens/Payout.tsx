import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MindsTokens from '../MindsTokens';

type PropsType = {
  minds: string;
  mindsPrice: string;
  isToday: boolean;
  store: any;
};

const Payout = ({ minds, mindsPrice, isToday, store }: PropsType) => {
  const theme = ThemedStyles.style;

  const refresh = (
    <TouchableOpacity
      onPress={() => store.loadRewards(store.selectedDate)}
      style={theme.alignSelfCenter}>
      <Icon
        name="refresh"
        color={ThemedStyles.getColor('secondary_text')}
        size={20}
      />
    </TouchableOpacity>
  );

  const payout = isToday ? (
    <View style={[styles.container, theme.borderPrimary]}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>{i18n.t('wallet.todayEstimate')}</Text>
      </View>
      <MindsTokens
        value={minds}
        mindsPrice={mindsPrice}
        textStyles={[theme.centered, theme.flexContainer]}
      />
      {refresh}
    </View>
  ) : (
    <View style={[styles.container, theme.borderPrimary]}>
      <Text style={[styles.text, styles.innerContainer]}>
        {i18n.t('wallet.usd.earnings')}
      </Text>
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
    paddingLeft: 20,
    paddingRight: 30,
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

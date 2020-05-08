import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';

const LearnMoreScreen = () => {
  const theme = ThemedStyles.style;
  const subTitleStyle = [styles.subTitle, theme.colorPrimaryText];
  const paragraph = [
    theme.fontL,
    theme.colorSecondaryText,
    theme.marginBottom3x,
  ];
  return (
    <ScrollView style={theme.padding3x}>
      <Text style={subTitleStyle}>{i18n.t('wallet.learnMore.howWork')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.p1')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.p2')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.p3')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.p4')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.p5')}</Text>

      <Text style={subTitleStyle}>
        {i18n.t('wallet.learnMore.howContributionsTitle')}
      </Text>
      <Text style={paragraph}>
        {i18n.t('wallet.learnMore.howContributionsP')}
      </Text>

      <Text style={subTitleStyle}>
        {i18n.t('wallet.learnMore.onChainTitle')}
      </Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.onChainP1')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.onChainP2')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.onChainP3')}</Text>
      <Text style={paragraph}>{i18n.t('wallet.learnMore.onChainP4')}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  subTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    letterSpacing: 0,
    marginVertical: 15,
  },
});

export default LearnMoreScreen;

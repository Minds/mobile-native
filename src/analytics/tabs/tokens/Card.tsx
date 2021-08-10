import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStores } from '../../../common/hooks/use-stores';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import MindsTokens, {
  format,
} from '../../../wallet/v3/currency-tabs/MindsTokens';
import { MetricsComparative, TokensMetrics } from '../../AnalyticsTypes';

type PropsType = {
  metrics: TokensMetrics;
  type: string;
};

const Card = ({ metrics, type }: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View style={styles.container}>
      <View style={theme.rowJustifySpaceBetween}>
        <Title type={type} />
        <Comparative comparative={metrics.comparative} total={metrics.total} />
      </View>
      <AmountInfo metrics={metrics} />
      {metrics.format !== 'points' && metrics.format !== 'usd' && (
        <Text style={theme.colorSecondaryText}>
          On-chain{' '}
          <Text style={theme.colorPrimaryText}>{format(metrics.onchain)}</Text>{' '}
          · Off-chain{' '}
          <Text style={theme.colorPrimaryText}>{format(metrics.offchain)}</Text>{' '}
        </Text>
      )}
    </View>
  );
};

const Title = ({ type }) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.rowJustifyStart}>
      <Text style={styles.title}>
        {i18n.t(`analytics.tokens.labels.${type}`)}
      </Text>
      <Tooltip
        skipAndroidStatusBar={true}
        withOverlay={false}
        containerStyle={theme.borderRadius}
        width={200}
        height={100}
        backgroundColor={ThemedStyles.getColor('Link')}
        popover={
          <Text style={theme.colorWhite}>
            {i18n.t(`analytics.tokens.tooltips.${type}`)}
          </Text>
        }>
        <Icon
          name="information-variant"
          size={15}
          color="#AEB0B8"
          style={theme.paddingTop}
        />
      </Tooltip>
    </View>
  );
};

const Comparative = ({
  comparative,
  total,
}: {
  comparative: MetricsComparative;
  total: string;
}) => {
  const theme = ThemedStyles.style;

  if (parseFloat(comparative.total_diff) === 0) {
    return null;
  }

  const prcnt = (parseFloat(comparative.total_diff) / parseFloat(total)) * 100;

  return (
    <View style={theme.rowJustifyStart}>
      <Icon
        name={`arrow-${comparative.increase ? 'up' : 'down'}`}
        size={20}
        color={comparative.increase ? '#59B814' : '#e03c20'}
      />
      <Text style={styles.comparativeText}>
        {format(comparative.total_diff)}{' '}
        <Text style={styles.comparativeText}>
          ({Math.round((prcnt + Number.EPSILON) * 100) / 100}%)
        </Text>
      </Text>
    </View>
  );
};

const AmountInfo = ({ metrics }: { metrics: TokensMetrics }) => {
  const theme = ThemedStyles.style;
  const { wallet } = useStores();
  let body;
  switch (metrics.format) {
    case 'token':
    case 'usd':
      body = (
        <MindsTokens
          textStyles={[styles.amountText, theme.colorPrimaryText]}
          secondaryTextStyle={styles.amountTextSecondary}
          mindsPrice={wallet.prices.minds}
          currencyType={metrics.format === 'token' ? 'tokens' : 'usd'}
          value={metrics.total}
          cashAsPrimary
        />
      );
      break;
    case 'number':
    case 'points':
      body = (
        <Text style={styles.amountText}>
          {format(metrics.total)}
          {metrics.format === 'points' && (
            <Text style={styles.amountTextSecondary}> {i18n.t('points')}</Text>
          )}
        </Text>
      );
      break;
  }

  return <View style={styles.bodyContainer}>{body}</View>;
};

const styles = ThemedStyles.create({
  bodyContainer: ['rowJustifyStart', 'marginTop2x', 'marginBottom3x'],
  container: [
    'bcolorPrimaryBorder',
    {
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderTopWidth: StyleSheet.hairlineWidth,
    },
  ],
  title: ['fontLM', 'colorSecondaryText', 'bold', 'marginRight'],
  comparativeText: [
    'colorSecondaryText',
    {
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
    },
  ],
  amountText: {
    fontWeight: '700',
    fontSize: 26,
  },
  amountTextSecondary: [
    'colorSecondaryText',
    {
      fontWeight: '700',
      fontSize: 20,
    },
  ],
});

export default Card;

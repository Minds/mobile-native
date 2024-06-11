import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Row } from '~/common/ui';
import MText from '~/common/components/MText';
import { useStores } from '~/common/hooks/use-stores';
import i18n from '~/common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import MindsTokens, {
  format,
} from '../../../wallet/v3/currency-tabs/MindsTokens';
import {
  CardType,
  MetricsComparative,
  TokensMetrics,
} from '../../AnalyticsTypes';
import { TENANT } from '~/config/Config';

type PropsType = {
  metrics: TokensMetrics;
  type: CardType;
};

const Card = ({ metrics, type }: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View style={styles.container}>
      <View style={theme.rowJustifySpaceBetween}>
        <Title type={type} />
        <Comparative comparative={metrics.comparative} total={metrics.total} />
      </View>
      {type === 'EmissionBreakDown' ? (
        <EmissionBreakDown content={metrics.content} />
      ) : (
        <>
          <AmountInfo metrics={metrics} />
          {metrics.format !== 'points' && metrics.format !== 'usd' ? (
            <MText style={theme.colorSecondaryText}>
              On-chain{' '}
              <MText style={theme.colorPrimaryText}>
                {format(metrics.onchain)}
              </MText>{' '}
              · Off-chain{' '}
              <MText style={theme.colorPrimaryText}>
                {format(metrics.offchain)}
              </MText>{' '}
            </MText>
          ) : null}
        </>
      )}
    </View>
  );
};

const Title = ({ type }: { type: CardType }) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.rowJustifyStart}>
      <MText style={styles.title}>
        {i18n.t(`analytics.tokens.labels.${type}`)}
      </MText>
      <Tooltip
        skipAndroidStatusBar={true}
        withOverlay={false}
        containerStyle={theme.borderRadius}
        width={200}
        height={100}
        backgroundColor={ThemedStyles.getColor('Link')}
        popover={
          <MText style={theme.colorWhite}>
            {i18n.t(`analytics.tokens.tooltips.${type}`, { TENANT })}
          </MText>
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

  if (parseFloat(comparative?.total_diff ?? '0') === 0) {
    return null;
  }

  const prcnt =
    (parseFloat(comparative?.total_diff ?? '0') / parseFloat(total)) * 100;

  return (
    <View style={theme.rowJustifyStart}>
      <Icon
        name={`arrow-${comparative.increase ? 'up' : 'down'}`}
        size={20}
        color={comparative.increase ? '#59B814' : '#e03c20'}
      />
      <MText style={styles.comparativeText}>
        {format(comparative?.total_diff ?? '0')}{' '}
        <MText style={styles.comparativeText}>
          ({Math.round((prcnt + Number.EPSILON) * 100) / 100}%)
        </MText>
      </MText>
    </View>
  );
};

const AmountInfo = ({ metrics }: { metrics: TokensMetrics }) => {
  const { wallet } = useStores();
  let body;
  switch (metrics.format) {
    case 'token':
    case 'usd':
      body = (
        <MindsTokens
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
        <MText style={styles.amountText}>
          {format(metrics.total)}
          {metrics.format === 'points' && (
            <MText style={styles.amountTextSecondary}>
              {' '}
              {i18n.t('points')}
            </MText>
          )}
        </MText>
      );
      break;
  }

  return <View style={styles.bodyContainer}>{body}</View>;
};

const EmissionBreakDown = ({ content = [] }: any) => (
  <>
    {content.map((item, index) => (
      <Row vertical="M" align="centerBetween" key={index}>
        <MText style={index === 0 ? styles.activeTitle : styles.title}>
          {item.title}
        </MText>
        <MText style={index === 0 ? styles.activeTitle : styles.title}>
          {item.value}
        </MText>
      </Row>
    ))}
  </>
);

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
      fontFamily: 'Roboto_500Medium',
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
  activeTitle: ['fontLM', 'bold', 'marginRight', 'marginTop3x'],
});

export default Card;

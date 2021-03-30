import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-animatable';
import CloseableModal, {
  CloseableModalProps,
} from '../../common/components/CloseableModal';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
export interface OrderReport {
  tokenAmount: number;
  paymentMethod: string;
  fiatAmount: number;
  fiatCurrency: string;
}

const styles = StyleSheet.create({
  wrap: {
    flexWrap: 'wrap',
  },
});

interface Props extends CloseableModalProps {
  report: OrderReport;
}

export default function ({ report, ...modalProps }: Props) {
  const theme = ThemedStyles.style;
  const { tokenAmount, paymentMethod, fiatAmount, fiatCurrency } = report;

  return (
    <CloseableModal {...modalProps}>
      <View
        style={[theme.flexContainer, theme.padding8x, theme.backgroundPrimary]}>
        <Text style={[theme.marginBottom5x, theme.fontXL]}>
          {i18n.t('orderReport.thanksMessage', {
            tokenAmount: String(tokenAmount).slice(0, 6),
          })}
        </Text>
        <Text
          style={[theme.marginBottom8x, theme.fontL, theme.colorSecondaryText]}>
          {i18n.t('orderReport.processDuration')}
        </Text>
        <View
          style={[
            theme.rowJustifySpaceBetween,
            theme.marginBottom5x,
            theme.borderTopHair,
            theme.borderBackgroundTertiary,
            theme.paddingTop5x,
            styles.wrap,
          ]}>
          <View>
            <Text style={theme.colorSecondaryText}>
              {i18n.t('orderReport.paymentMethod')}
            </Text>
            <Text style={theme.fontXL}>{paymentMethod}</Text>
          </View>
          <View>
            <Text style={theme.colorSecondaryText}>
              {i18n.t('orderReport.tokenAmount')}
            </Text>
            <Text style={theme.fontXL}>{String(tokenAmount).slice(0, 6)}</Text>
          </View>
          <View style={theme.paddingTop5x}>
            <Text style={theme.colorSecondaryText}>
              {i18n.t('orderReport.totalPayment')}
            </Text>
            <Text style={theme.fontXL}>
              {fiatAmount} {fiatCurrency}
            </Text>
          </View>
        </View>
      </View>
    </CloseableModal>
  );
}

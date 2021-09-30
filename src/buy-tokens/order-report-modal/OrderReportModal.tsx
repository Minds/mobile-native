import React from 'react';
import { StyleSheet, View } from 'react-native';
import CloseableModal, {
  CloseableModalProps,
} from '../../common/components/CloseableModal';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import MText from '../../common/components/MText';
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
        style={[
          theme.flexContainer,
          theme.padding8x,
          theme.bgPrimaryBackground,
        ]}
      >
        <MText style={[theme.marginBottom5x, theme.fontXL]}>
          {i18n.t('orderReport.thanksMessage', {
            tokenAmount: String(tokenAmount).slice(0, 6),
          })}
        </MText>
        <MText
          style={[theme.marginBottom8x, theme.fontL, theme.colorSecondaryText]}
        >
          {i18n.t('orderReport.processDuration')}
        </MText>
        <View
          style={[
            theme.rowJustifySpaceBetween,
            theme.marginBottom5x,
            theme.borderTopHair,
            theme.bcolorTertiaryBackground,
            theme.paddingTop5x,
            styles.wrap,
          ]}
        >
          <View>
            <MText style={theme.colorSecondaryText}>
              {i18n.t('orderReport.paymentMethod')}
            </MText>
            <MText style={theme.fontXL}>{paymentMethod}</MText>
          </View>
          <View>
            <MText style={theme.colorSecondaryText}>
              {i18n.t('orderReport.tokenAmount')}
            </MText>
            <MText style={theme.fontXL}>
              {String(tokenAmount).slice(0, 6)}
            </MText>
          </View>
          <View style={theme.paddingTop5x}>
            <MText style={theme.colorSecondaryText}>
              {i18n.t('orderReport.totalPayment')}
            </MText>
            <MText style={theme.fontXL}>
              {fiatAmount} {fiatCurrency}
            </MText>
          </View>
        </View>
      </View>
    </CloseableModal>
  );
}

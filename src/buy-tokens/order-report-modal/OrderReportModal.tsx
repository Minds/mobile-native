import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-animatable';
import CloseableModal, {
  CloseableModalProps,
} from '../../common/components/CloseableModal';
import ThemedStyles from '../../styles/ThemedStyles';

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
          Thank you. We've received your order for{' '}
          {String(tokenAmount).slice(0, 6)} Minds tokens.
        </Text>
        <Text
          style={[theme.marginBottom8x, theme.fontL, theme.colorSecondaryText]}>
          It normally takes a few minutes for your order to be delivered. You
          will receive a confirmation email once your order is processed.
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
            <Text style={theme.colorSecondaryText}>Payment Method</Text>
            <Text style={theme.fontXL}>{paymentMethod}</Text>
          </View>
          <View>
            <Text style={theme.colorSecondaryText}>Token Amount</Text>
            <Text style={theme.fontXL}>{String(tokenAmount).slice(0, 6)}</Text>
          </View>
          <View style={theme.paddingTop5x}>
            <Text style={theme.colorSecondaryText}>Total Payment</Text>
            <Text style={theme.fontXL}>
              {fiatAmount} {fiatCurrency}
            </Text>
          </View>
        </View>
      </View>
    </CloseableModal>
  );
}

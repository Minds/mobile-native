import React from 'react';
import { View } from 'react-native';
import { B1, B2, Row } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';
import { useTranslation } from '../../../locales';
import BoostModel from '../../../models/BoostModelV3';
import { BoostPaymentMethod, BoostStatus } from '../../types/BoostConsoleBoost';

interface BoostHeader {
  boost: BoostModel;
}

export default function BoostHeader({ boost }: BoostHeader) {
  const { t } = useTranslation();

  const cashLabel = t('${{amount}} over {{duration}} days', {
    amount: boost.payment_amount,
    duration: boost.duration_days,
  });
  const tokenLabel = t('{{amount}} tokens over {{duration}} days', {
    amount: boost.payment_amount,
    duration: boost.duration_days,
  });

  const boostStatusText = {
    [BoostStatus.PENDING]: t('Pending'),
    [BoostStatus.APPROVED]: t('Approved'),
    [BoostStatus.REJECTED]: t('Rejected'),
    [BoostStatus.REFUND_IN_PROGRESS]: t('Refund in progress'),
    [BoostStatus.REFUND_PROCESSED]: t('Refunded'),
    [BoostStatus.FAILED]: t('Failed'),
    [BoostStatus.REPORTED]: t('Reported'),
  };

  return (
    <Row top="M" left="L">
      <View style={styles.rectangle}>
        <B2 font="medium" color="white" horizontal="S">
          {boost.payment_method === BoostPaymentMethod.cash
            ? cashLabel
            : tokenLabel}
        </B2>
      </View>
      <B1 left="L">{boostStatusText[boost.boost_status]}</B1>
    </Row>
  );
}

const styles = ThemedStyles.create({
  rectangle: ['borderRadius4x', 'bgLink', 'padding', 'alignSelfStart'],
});

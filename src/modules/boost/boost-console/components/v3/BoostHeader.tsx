import moment from 'moment';
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
  const tillExpiration =
    boost.approved_timestamp && boost.boost_status === BoostStatus.APPROVED
      ? moment(boost.approved_timestamp * 1000)
          .add({ days: boost.duration_days })
          .fromNow()
      : null;

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
    [BoostStatus.REFUND_IN_PROGRESS]: t('Refund in Progress'),
    [BoostStatus.REFUND_PROCESSED]: t('Refund Completed'),
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
      {tillExpiration ? (
        <B1 color="secondary">{t('Ends: ') + tillExpiration}</B1>
      ) : (
        <B1>{boostStatusText[boost.boost_status]}</B1>
      )}
    </Row>
  );
}

const styles = ThemedStyles.create({
  rectangle: [
    'borderRadius4x',
    'bgLink',
    'padding',
    'alignSelfStart',
    'marginRight2x',
  ],
});

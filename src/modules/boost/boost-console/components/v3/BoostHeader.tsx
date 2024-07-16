import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { B1, B2, Icon, Row } from '~/common/ui';

import type UserModel from '../../../../../channel/UserModel';
import { useTranslation } from '../../../locales';
import BoostModel from '../../../models/BoostModelV3';
import { BoostPaymentMethod, BoostStatus } from '../../types/BoostConsoleBoost';
import { getColor } from '~/common/ui/buttons/helpers';
import sp from '~/services/serviceProvider';

interface BoostHeader {
  boost: BoostModel;
}

export default function BoostHeader({ boost }: BoostHeader) {
  const { t } = useTranslation();
  const receiverUser = boost.entity?.supermind?.receiver_user;
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

  const boostStatusText: Record<BoostStatus, string> = {
    [BoostStatus.PENDING]: t('Pending'),
    [BoostStatus.APPROVED]: t('Approved'),
    [BoostStatus.REJECTED]: t('Rejected'),
    [BoostStatus.REFUND_IN_PROGRESS]: t('Refund in Progress'),
    [BoostStatus.REFUND_PROCESSED]: t('Refund Completed'),
    [BoostStatus.FAILED]: t('Failed'),
    [BoostStatus.REPORTED]: t('Reported'),
    [BoostStatus.COMPLETED]: t('Completed'),
    [BoostStatus.CANCELLED]: t('Cancelled'),
    [BoostStatus.PENDING_ONCHAIN_CONFIRMATION]: t(
      'Pending on-chain confirmation',
    ),
  };
  const { textColor } = getColor({ theme: sp.styles.theme });

  return (
    <>
      <Row top="M" left="L">
        <View style={styles.rectangle}>
          <B2 font="medium" color={textColor} horizontal="S">
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
      {!!receiverUser && <SupermindTarget channel={receiverUser} />}
    </>
  );
}

const SupermindTarget = ({ channel }: { channel: UserModel }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navToTarget = () => {
    navigation.navigate('Channel', {
      guid: channel.guid,
      entity: channel,
    });
  };

  return (
    <Row top="S" left="L" align="centerStart">
      <Icon name="supermind" size="tiny" right="XS" />
      <B1 onPress={navToTarget} color="secondary">
        {t('Supermind to @{{user}}', { user: channel.username })}
      </B1>
    </Row>
  );
};

const styles = sp.styles.create({
  rectangle: [
    'borderRadius4x',
    'bgLink',
    'padding',
    'alignSelfStart',
    'marginRight2x',
  ],
});

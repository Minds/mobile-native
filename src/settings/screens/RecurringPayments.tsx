import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import type { SubscriptionType } from '~/common/services/payment.service';
import CenteredLoading from '~/common/components/CenteredLoading';
import MenuItem from '~/common/components/menus/MenuItem';
import Button from '~/common/components/Button';
import capitalize from '~/common/helpers/capitalize';
import MText from '~/common/components/MText';
import { useService } from '~/services/hooks/useService';
import sp from '~/services/serviceProvider';

const RecurringPayments = () => {
  const theme = sp.styles.style;

  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);

  const paymentService = useService('payment');

  useEffect(() => {
    async function getSubscriptions() {
      setSubscriptions(await paymentService.subscriptions());
      setLoading(false);
    }
    getSubscriptions();
  }, [setSubscriptions, setLoading, paymentService]);

  const cancel = useCallback(
    async id => {
      setLoading(true);
      await paymentService.cancelSubscriptions(id);
      setSubscriptions(await paymentService.subscriptions());
      setLoading(false);
    },
    [paymentService],
  );

  const getTitle = (subscription: SubscriptionType) => {
    const username = subscription.entity
      ? subscription.entity.type === 'user'
        ? subscription.entity.username
        : subscription.entity.ownerObj.username
      : '';

    let payment = '';
    let amount = 0;
    switch (subscription.payment_method) {
      case 'money':
      case 'usd':
        payment = 'USD';
        amount = Number(subscription.amount) / Math.pow(10, 2);
        break;
      case 'tokens':
        payment = 'Tokens';
        amount = Number(subscription.amount) / Math.pow(10, 18);
        break;
      case 'points':
        payment = 'Points';
        amount = Number.parseFloat(subscription.amount || '0');
        break;
    }

    return `${capitalize(
      subscription.plan_id || '',
    )} @${username} ${amount} ${payment}`;
  };

  if (loading) {
    return <CenteredLoading />;
  }

  if (subscriptions.length === 0) {
    return (
      <View
        style={[theme.flexContainer, theme.centered, theme.paddingBottom7x]}>
        <MText style={[theme.fontXL, theme.colorSecondaryText]}>
          {sp.i18n.t('settings.subscriptionListEmpty')}
        </MText>
      </View>
    );
  }

  return (
    <ScrollView style={[theme.flexContainer]}>
      <MText style={[theme.fontM, theme.padding2x, theme.colorSecondaryText]}>
        {sp.i18n.t('settings.recurringPaymentsDescription')}
      </MText>
      {subscriptions.slice().map((subscription: SubscriptionType) => {
        return (
          <MenuItem
            key={`${subscription.guid}`}
            title={getTitle(subscription)}
            icon={
              <Button
                text={sp.i18n.t('cancel')}
                onPress={() => cancel(subscription.id)}
              />
            }
          />
        );
      })}
    </ScrollView>
  );
};

export default RecurringPayments;

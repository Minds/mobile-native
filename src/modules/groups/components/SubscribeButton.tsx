import React from 'react';
import i18n from '~/common/services/i18n.service';
import type GroupModel from '~/groups/GroupModel';
import { Button } from '~ui';

/**
 * Group subscribe button
 */
export default function SubscribeButton({ group }: { group: GroupModel }) {
  const subscriptionText = group['is:member']
    ? i18n.t('leave')
    : i18n.t('join');

  const [loading, setLoading] = React.useState(false);

  const onSubscriptionPress = async () => {
    setLoading(true);
    try {
      await (group['is:member'] ? group.leave() : group.join());
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      mode="outline"
      type={group['is:member'] ? 'base' : 'action'}
      size="tiny"
      disabled={loading}
      onPress={onSubscriptionPress}
      pressableProps={HITSLOP}
      testID="groupSubscribeButton">
      {subscriptionText}
    </Button>
  );
}

const HITSLOP = {
  hitSlop: 10,
};

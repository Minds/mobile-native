import React from 'react';
import i18n from '~/common/services/i18n.service';
import type GroupModel from '~/groups/GroupModel';
import { Button, Row } from '~ui';

type GroupMembershipButtonType =
  | 'join'
  | 'leave'
  | 'awaiting'
  | 'invited'
  | null;

/**
 * Group subscribe button
 */
export default function SubscribeButton({ group }: { group: GroupModel }) {
  let buttonType: GroupMembershipButtonType = null;
  const [loading, setLoading] = React.useState(false);

  console.log('group', group);

  if (
    !group.isMember &&
    !group.isAwaiting &&
    !group.isInvited &&
    !group.isBanned
  ) {
    buttonType = 'join';
  } else if (group.isMember) {
    buttonType = 'leave';
  } else if (group.isInvited) {
    buttonType = 'invited';
  } else if (group.isAwaiting) {
    buttonType = 'awaiting';
  }

  if (!buttonType) {
    return null;
  }

  const buttonText = i18n.t(
    buttonType !== 'invited' ? buttonType : 'group.buttonInvited',
  );

  const onSubscriptionPress = async () => {
    setLoading(true);
    try {
      switch (buttonType) {
        case 'join':
          await group.join();
          break;
        case 'leave':
          await group.leave();
          break;
        case 'invited':
          await group.acceptInvitation();
          break;
        case 'awaiting':
          await group.cancelRequest();
        default:
          break;
      }
    } catch (error) {
      console.error('Group subscription error', error);
    } finally {
      setLoading(false);
    }
  };

  const onCancelPress = async () => {
    setLoading(true);
    try {
      await group.declineInvitation();
    } finally {
      setLoading(false);
    }
  };

  const FirstButton = (
    <Button
      mode="outline"
      type={buttonType === 'leave' ? 'base' : 'action'}
      size="tiny"
      disabled={loading}
      onPress={onSubscriptionPress}
      pressableProps={HITSLOP}
      testID="groupSubscribeButton">
      {buttonText}
    </Button>
  );

  return buttonType !== 'invited' ? (
    FirstButton
  ) : (
    <Row>
      {FirstButton}
      <Button
        mode="outline"
        type="base"
        size="tiny"
        disabled={loading}
        onPress={onCancelPress}
        pressableProps={HITSLOP}
        testID="groupCancelButton">
        {i18n.t('reject')}
      </Button>
    </Row>
  );
}

const HITSLOP = {
  hitSlop: 10,
};

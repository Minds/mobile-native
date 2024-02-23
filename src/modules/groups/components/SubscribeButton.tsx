import { observer } from 'mobx-react';
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

type SubscribeButtonProps = {
  group: GroupModel;
  onPress?: () => void;
  testID?: string;
};

/**
 * Group subscribe button
 */
function SubscribeButton({ group, onPress, testID }: SubscribeButtonProps) {
  let buttonType: GroupMembershipButtonType = null;
  const [loading, setLoading] = React.useState(false);

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
      onPress?.();
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
      testID={testID}>
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

export default observer(SubscribeButton);

const HITSLOP = {
  hitSlop: 10,
};

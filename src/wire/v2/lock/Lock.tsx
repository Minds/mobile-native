import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { View, Text, StyleSheet } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import LockTag from './LockTag';
import { SupportTiersType } from '../../WireTypes';
import mindsService from '../../../common/services/minds.service';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import type { LockType } from '../../../types/Common';
import currency from '../../../common/helpers/currency';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
};

const getLockType = (support_tier: SupportTiersType): LockType => {
  let type: LockType = support_tier.public ? 'members' : 'paywall';

  if (mindsService.settings.plus.support_tier_urn === support_tier.urn) {
    type = 'plus';
  }

  return type;
};

const getTextForBlocked = (
  type: LockType,
  support_tier: SupportTiersType,
  username: string,
) => {
  let message = '';
  switch (type) {
    case 'members':
      message = `Join @${username}'s ${support_tier.name} Membership to see this post`;
      break;
    case 'plus':
      message = 'Join Minds+ to view this post';
      break;
    case 'paywall':
      message = `Join @${username}'s Custom Membership for ${currency(
        parseFloat(support_tier.usd),
        'usd',
        'prefix',
      )} per month to see this post`;
      break;
  }
  return message;
};

const Lock = observer(({ entity }: PropsType) => {
  const theme = ThemedStyles.style;
  const wire_threshold = entity.wire_threshold;
  const support_tier: SupportTiersType | null =
    wire_threshold && 'support_tier' in wire_threshold
      ? wire_threshold.support_tier
      : null;
  // we don´t know yet what the data structure be like
  let lockType: LockType = 'paywall';
  let message = 'Pay to see this post';

  if (support_tier) {
    lockType = getLockType(support_tier);
    message = getTextForBlocked(
      lockType,
      support_tier,
      entity.ownerObj.username,
    );
  } else {
    if (wire_threshold && 'min' in wire_threshold) {
      message = `This post can only be seen by supporters who send over ${currency(
        wire_threshold.min,
        wire_threshold.type === 'money' ? 'money' : 'token',
        wire_threshold.type === 'money' ? 'prefix' : 'suffix',
      )} to @${entity.ownerObj.username}`;
    }
  }

  if (entity.isOwner() || entity.hasVideo()) {
    return <LockTag type={lockType} />;
  }

  const unlock = useCallback(() => {
    entity.unlockOrPay();
  }, [entity]);

  const button = entity.hasVideo() ? null : (
    <Button
      onPress={unlock}
      text={i18n.t('unlockPost')}
      containerStyle={theme.paddingVertical2x}
    />
  );

  if (!entity.hasThumbnails() && !entity.hasMedia()) {
    return (
      <View
        style={[
          styles.mask,
          theme.backgroundSeparator,
          theme.centered,
          theme.padding2x,
        ]}>
        <Text
          style={[
            theme.colorWhite,
            styles.lockMessage,
            theme.marginBottom2x,
            theme.textCenter,
          ]}>
          {message}
        </Text>
        {button}
        <LockTag type={lockType} />
      </View>
    );
  }

  let aspectRatio =
    entity.custom_data &&
    entity.custom_data[0] &&
    entity.custom_data[0].width / entity.custom_data[0].height;

  return (
    <View
      style={[
        styles.backgroundImage,
        styles.mask,
        aspectRatio ? { aspectRatio } : theme.fullHeight,
      ]}>
      <Text
        style={[
          theme.colorWhite,
          styles.lockMessage,
          theme.marginBottom2x,
          theme.textCenter,
        ]}>
        {message}
      </Text>
      {button}
      <LockTag type={lockType} />
    </View>
  );
});

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    top: 0,
    width: '100%',
    minHeight: 150,
    zIndex: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    position: 'relative',
    alignSelf: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  lockMessage: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 1,
  },
});

export default Lock;

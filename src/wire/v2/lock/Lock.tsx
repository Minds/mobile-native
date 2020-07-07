import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedStyles from '../../../styles/ThemedStyles';
import LockTag from './LockTag';
import Colors from '../../../styles/Colors';
import Touchable from '../../../common/components/Touchable';
import WireService from '../../WireService';
import { SupportTiersType } from '../../WireTypes';
import mindsService from '../../../common/services/minds.service';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
};

type LockType = 'members' | 'paywall' | 'plus';

const getLockType = (support_tier: SupportTiersType): LockType => {
  let type: LockType = support_tier.public ? 'members' : 'paywall';

  if (mindsService.settings.plus.support_tier_urn === support_tier.urn) {
    type = 'plus';
  }

  return type;
};

const getTextForBlocked = (type: LockType, support_tier: SupportTiersType) => {
  let message = '';
  switch (type) {
    case 'members':
      message = `Become ${support_tier.name} to view this post`;
      break;
    case 'plus':
      message = 'Join Minds+ to view this post';
      break;
    case 'paywall':
      const payUsd = support_tier.has_usd ? `${support_tier.usd} USD` : '';
      const payTokens = support_tier.has_tokens
        ? `${support_tier.tokens} Tokens`
        : '';
      let pay = payUsd;
      pay +=
        pay !== '' ? (payTokens !== '' ? ` / ${payTokens}` : '') : payTokens;
      message = `Pay ${pay} to see this post`;
      break;
  }
  return message;
};

const Lock = observer(({ entity, navigation }: PropsType) => {
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
    message = getTextForBlocked(lockType, support_tier);
  }

  const unlock = useCallback(() => {
    //this.setState({ unlocking: true });

    entity.unlock(true).then((result) => {
      //this.setState({ unlocking: false });
      if (result) return;

      switch (lockType) {
        case 'plus':
          navigation.push('PlusScreen', {
            support_tier,
            entity,
            onComplete: (resultComplete: any) => {
              if (
                resultComplete &&
                resultComplete.payload.method === 'onchain'
              ) {
                setTimeout(() => {
                  Alert.alert(
                    i18n.t('wire.weHaveReceivedYourTransaction'),
                    i18n.t('wire.pleaseTryUnlockingMessage'),
                  );
                }, 400);
              } else {
                entity.unlock();
              }
            },
          });
          break;
        case 'members':
        case 'paywall':
          navigation.push('JoinMembershipScreen', {
            support_tier,
            entity,
            onComplete: (resultComplete: any) => {
              if (
                resultComplete &&
                resultComplete.payload.method === 'onchain'
              ) {
                setTimeout(() => {
                  Alert.alert(
                    i18n.t('wire.weHaveReceivedYourTransaction'),
                    i18n.t('wire.pleaseTryUnlockingMessage'),
                  );
                }, 400);
              } else {
                entity.unlock();
              }
            },
          });
      }
    });
  }, [navigation, lockType, entity, support_tier]);

  const unlockBlock = (
    <>
      <Text
        style={[theme.colorWhite, styles.lockMessage, theme.marginBottom2x]}>
        {message}
      </Text>
      <Button
        onPress={unlock}
        text={i18n.t('unlockPost')}
        containerStyle={theme.paddingVertical2x}
      />
    </>
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
        {unlockBlock}
        <LockTag type={lockType} />
      </View>
    );
  }

  const playButton =
    entity.hasMedia() &&
    (entity.custom_type === 'video' || entity.subtype === 'video') ? (
      <Icon
        style={styles.videoIcon}
        name="play-circle-outline"
        size={86}
        color={Colors.light}
      />
    ) : null;

  return (
    <ImageBackground
      style={[styles.backgroundImage, styles.mask]}
      source={entity.getThumbSource('large')}
      resizeMode="cover">
      {unlockBlock}
      <LockTag type={lockType} />
      {playButton}
    </ImageBackground>
  );
});

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    width: '100%',
    zIndex: 10,
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
  },
});

export default Lock;

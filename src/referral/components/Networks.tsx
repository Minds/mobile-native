import React from 'react';
import { Linking, View } from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';
import { IS_IOS, TENANT } from '~/config/Config';
import MText from '~/common/components/MText';
import Touchable from '~/common/components/Touchable';

import sp from '~/services/serviceProvider';

interface NetworksProps {
  referralLink: string;
}

type IconName = React.ComponentProps<typeof IonIcon>['name'];

type NetworkItem = {
  key: string;
  icon: IconName;
  color: string;
  onPress: () => void;
};

const Networks = ({ referralLink }: NetworksProps) => {
  const theme = sp.styles.style;

  const message = sp.i18n.t('referrals.joinMeOnMinds', { TENANT });

  const networks = (
    [
      {
        key: 'facebook',
        icon: 'logo-facebook',
        color: '#3b5998',
        onPress: () =>
          Linking.openURL(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              referralLink,
            )}`,
          ),
      },
      {
        key: 'twitter',
        icon: 'logo-twitter',
        color: '#1da1f2',
        onPress: () =>
          Linking.openURL(
            `https://twitter.com/intent/tweet?tw_p=tweetbutton&text=${encodeURIComponent(
              message,
            )}&url=${encodeURIComponent(referralLink)}`,
          ),
      },
      {
        key: 'mail',
        icon: 'mail',
        color: theme.colorSecondaryText.color,
        onPress: () => {
          Linking.openURL(
            IS_IOS
              ? `mailto:?subject=${message}&body=${message} ${referralLink}` // workaround iOS encoding issue https://developer.apple.com/forums/thread/681023
              : `mailto:?subject=${encodeURI(
                  message,
                )}&body=${message}%0D%0A${encodeURIComponent(referralLink)}`,
          );
        },
      },
    ] as NetworkItem[]
  ).map(i => {
    return (
      <Touchable key={i.key} onPress={i.onPress} style={theme.marginRight4x}>
        <IonIcon name={i.icon} color={i.color} size={25} />
      </Touchable>
    );
  });

  return (
    <>
      <MText>{sp.i18n.t('referrals.moreWaysToShare')}</MText>
      <View style={[theme.rowJustifyStart, theme.marginTop2x]}>{networks}</View>
    </>
  );
};

export default Networks;

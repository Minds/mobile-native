import React from 'react';
import { Linking, Text, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Touchable from '../../common/components/Touchable';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

interface NetworksProps {
  referralLink: string;
}

const Networks = ({ referralLink }: NetworksProps) => {
  const theme = ThemedStyles.style;

  const message = i18n.t('referrals.joinMeOnMinds');

  const networks = [
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
        console.log(
          `mailto:?subject=${encodeURI(
            message,
          )}&body=${message}%0D%0A${encodeURIComponent(referralLink)}`,
        );
        Linking.openURL(
          `mailto:?subject=${encodeURI(
            message,
          )}&body=${message}%0D%0A${encodeURIComponent(referralLink)}`,
        );
      },
    },
  ].map((i) => {
    return (
      <Touchable key={i.key} onPress={i.onPress} style={theme.marginRight4x}>
        <IonIcon name={i.icon} color={i.color} size={25} />
      </Touchable>
    );
  });

  return (
    <>
      <Text>{i18n.t('referrals.moreWaysToShare')}</Text>
      <View style={[theme.rowJustifyStart, theme.marginTop2x]}>{networks}</View>
    </>
  );
};

export default Networks;

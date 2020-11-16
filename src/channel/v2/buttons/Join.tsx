import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import { styles } from './styles';

type PropsType = {
  showSubscribe: boolean | undefined;
  navigation: any;
} & ChannelButtonsPropsType;

const isIos = Platform.OS === 'ios';

const Join = ({ showSubscribe, navigation, ...props }: PropsType) => {
  const theme = ThemedStyles.style;

  const join = useCallback(() => {
    if (props.store.channel) {
      navigation.push('JoinMembershipScreen', {
        user: props.store.channel,
        tiers: props.store.tiers,
      });
    }
  }, [navigation, props.store.channel, props.store.tiers]);

  return (
    <Button
      color={
        showSubscribe
          ? ThemedStyles.getColor('secondary_background')
          : ThemedStyles.getColor('green')
      }
      text={i18n.t('join')}
      textStyle={[
        isIos ? theme.fontL : theme.fontM,
        !ThemedStyles.theme && !showSubscribe ? null : theme.colorPrimaryText,
      ]}
      containerStyle={styles.button}
      textColor="white"
      onPress={join}
      inverted
    />
  );
};

export default Join;

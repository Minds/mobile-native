import React from 'react';
import { Platform } from 'react-native';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import { styles } from './styles';

const isIos = Platform.OS === 'ios';

const Subscribe = (props: ChannelButtonsPropsType) => {
  const theme = ThemedStyles.style;
  const subscriptionText = '+ ' + i18n.t('channel.subscribe');

  return (
    <Button
      color={ThemedStyles.getColor('green')}
      text={subscriptionText}
      textStyle={isIos ? theme.fontL : theme.fontM}
      containerStyle={styles.button}
      textColor="white"
      onPress={props.store.channel!.toggleSubscription}
      inverted
    />
  );
};

export default Subscribe;

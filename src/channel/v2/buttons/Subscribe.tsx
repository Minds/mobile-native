import React from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import { ChannelButtonsPropsType } from '../ChannelButtons';

const Subscribe = (props: ChannelButtonsPropsType) => {
  const subscriptionText = i18n.t('channel.subscribe');
  const buttonStyle = useStyle({
    borderWidth: 2,
    borderColor: ThemedStyles.getColor('Link'),
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: ThemedStyles.getColor('Link'),
    borderRadius: 100,
  });

  return (
    <Button
      text={subscriptionText}
      onPress={props.store.channel!.toggleSubscription}
      xSmall
      color={ThemedStyles.getColor('White')}
      style={buttonStyle}
    />
  );
};

export default Subscribe;

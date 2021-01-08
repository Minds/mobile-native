import React, { useCallback } from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import { ChannelButtonsPropsType } from '../ChannelButtons';

type PropsType = {
  showSubscribe: boolean | undefined;
  navigation: any;
} & ChannelButtonsPropsType;

const Join = ({ navigation, ...props }: PropsType) => {
  const join = useCallback(() => {
    if (props.store.channel) {
      navigation.push('JoinMembershipScreen', {
        user: props.store.channel,
        tiers: props.store.tiers,
      });
    }
  }, [navigation, props.store.channel, props.store.tiers]);

  return <Button text={i18n.t('join')} onPress={join} xSmall />;
};

export default Join;

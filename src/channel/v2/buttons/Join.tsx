import React, { useCallback } from 'react';
import Button from '../../../common/components/Button';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import serviceProvider from '~/services/serviceProvider';

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

  return <Button text={serviceProvider.i18n.t('join')} onPress={join} xSmall />;
};

export default Join;

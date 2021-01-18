import React from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import { ChannelButtonsPropsType } from '../ChannelButtons';

const Edit = (props: ChannelButtonsPropsType) => {
  return (
    <Button
      text={i18n.t('channel.editChannel')}
      onPress={props.onEditPress}
      xSmall
    />
  );
};

export default Edit;

import React from 'react';
import i18n from '../../../common/services/i18n.service';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import { Button } from '~ui';

const Edit = (props: ChannelButtonsPropsType) => {
  return (
    <Button onPress={props.onEditPress} size="tiny" mode="outline">
      {i18n.t('edit')}
    </Button>
  );
};

export default Edit;

import React from 'react';
import { ChannelButtonsPropsType } from '../ChannelButtons';
import { Button } from '~ui';
import serviceProvider from '~/services/serviceProvider';

const Edit = (props: ChannelButtonsPropsType) => {
  return (
    <Button onPress={props.onEditPress} size="tiny" mode="outline">
      {serviceProvider.i18n.t('edit')}
    </Button>
  );
};

export default Edit;

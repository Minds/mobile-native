import React from 'react';
import Button from '../../../common/components/ButtonV2';
import i18n from '../../../common/services/i18n.service';
import { ChannelButtonsPropsType } from '../ChannelButtons';

const Edit = (props: ChannelButtonsPropsType) => {
  return <Button text={i18n.t('edit')} onPress={props.onEditPress} small />;
};

export default Edit;

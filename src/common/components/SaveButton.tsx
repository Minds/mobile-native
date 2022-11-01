import React from 'react';
import i18n from '../services/i18n.service';
import { TextStyle } from 'react-native';
import { Button, Spacer } from '~ui';

type propsType = {
  onPress: () => void;
  text?: string;
  spinner?: boolean;
  style?: TextStyle | TextStyle[];
  disabled?: boolean;
};

const SaveButton = ({ onPress, text, spinner, style, disabled }: propsType) => {
  return (
    <Spacer containerStyle={style}>
      <Button
        disabled={disabled}
        onPress={onPress}
        spinner={spinner}
        mode="flat"
        type="action"
        size="small">
        {text || i18n.t('save')}
      </Button>
    </Spacer>
  );
};

export default SaveButton;

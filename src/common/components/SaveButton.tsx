import React from 'react';
import { TextStyle } from 'react-native';
import { Button, Spacer } from '~ui';
import sp from '~/services/serviceProvider';

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
        {text || sp.i18n.t('save')}
      </Button>
    </Spacer>
  );
};

export default SaveButton;

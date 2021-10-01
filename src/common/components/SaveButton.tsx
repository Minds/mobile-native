import React from 'react';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { TextStyle } from 'react-native';
import MText from './MText';

type propsType = {
  onPress: () => void;
  text?: string;
  style?: TextStyle | TextStyle[];
};

const SaveButton = ({ onPress, text, style }: propsType) => {
  const theme = ThemedStyles.style;
  return (
    <MText
      onPress={onPress}
      style={[theme.colorLink, theme.fontL, theme.bold, style]}>
      {text || i18n.t('save')}
    </MText>
  );
};

export default SaveButton;

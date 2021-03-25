import React from 'react';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Text, TextStyle } from 'react-native';

type propsType = {
  onPress: () => void;
  text?: string;
  style?: TextStyle | TextStyle[];
};

const SaveButton = ({ onPress, text, style }: propsType) => {
  const theme = ThemedStyles.style;
  return (
    <Text
      onPress={onPress}
      style={[theme.colorLink, theme.fontL, theme.bold, style]}>
      {text || i18n.t('save')}
    </Text>
  );
};

export default SaveButton;

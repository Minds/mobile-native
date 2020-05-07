import React from 'react';
import i18n from '../services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { Text } from 'react-native';

type propsType = {
  onPress: () => void;
};

const SaveButton = ({ onPress }: propsType) => {
  const theme = ThemedStyles.style;
  return (
    <Text onPress={onPress} style={[theme.colorLink, theme.fontL, theme.bold]}>
      {i18n.t('save')}
    </Text>
  );
};

export default SaveButton;

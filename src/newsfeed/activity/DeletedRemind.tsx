import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

export default function DeletedRemind() {
  const theme = ThemedStyles.style;
  return (
    <View style={[theme.columnAlignCenter, theme.padding4x]}>
      <Icon
        name="md-information-circle"
        size={35}
        style={[theme.colorSecondaryText, theme.paddingRight]}
      />
      <Text style={theme.fontM}>{i18nService.t('deletedRemind')}</Text>
    </View>
  );
}

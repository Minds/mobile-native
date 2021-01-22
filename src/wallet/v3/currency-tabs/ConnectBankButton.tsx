import React from 'react';
import { Text } from 'react-native';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ConnectBankButton = () => {
  const theme = ThemedStyles.style;
  const isConnected = false;
  const buttonChildren = isConnected ? (
    <Text style={[theme.colorSecondaryText, theme.fontL]}>***6155</Text>
  ) : (
    <>
      <Text style={theme.fontL}>{i18n.t('onboarding.connectBank')}</Text>
      <Icon
        name="plus-circle"
        size={16}
        color={ThemedStyles.getColor('primary_text')}
        style={theme.marginLeft2x}
      />
    </>
  );

  return <Button xSmall>{buttonChildren}</Button>;
};

export default ConnectBankButton;

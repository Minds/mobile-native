import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { ResetPasswordStore } from './createLocalStore';

type PropsType = {
  store: ResetPasswordStore;
};

const CText = ({ children }) => <Text style={textStyle}>{children}</Text>;
const EmailSended = ({ store }: PropsType) => {
  return (
    <View style={containerStyle}>
      <CText>{i18n.t('auth.emailSent')}</CText>
      <CText>{i18n.t('auth.followInstuctions')}</CText>
      <TouchableOpacity style={touchableStyle} onPress={store.sendEmail}>
        <CText>{i18n.t('auth.sendAgain')}</CText>
      </TouchableOpacity>
    </View>
  );
};
export const containerStyle = ThemedStyles.combine(
  'paddingHorizontal10x',
  'borderTopHair',
  'bcolorPrimaryBorder_Dark',
);

export const textStyle = ThemedStyles.combine(
  'colorSecondaryText_Dark',
  'fontL',
  'fontMedium',
  'marginTop4x',
  'textCenter',
);

const touchableStyle = ThemedStyles.combine('marginTop6x', 'marginBottom20x');

export default EmailSended;

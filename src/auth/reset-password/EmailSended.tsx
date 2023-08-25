import React from 'react';
import { View } from 'react-native';
import MText from '../../common/components/MText';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { ResetPasswordStore } from './createLocalStore';
import { Button } from '~/common/ui';

type PropsType = {
  store: ResetPasswordStore;
};

const CText = ({ children }) => <MText style={textStyle}>{children}</MText>;
const EmailSended = ({ store }: PropsType) => {
  return (
    <View style={containerStyle}>
      <CText>{i18n.t('auth.emailSent')}</CText>
      <CText>{i18n.t('auth.followInstuctions')}</CText>
      <Button onPress={store.sendEmail} vertical="L2" type={'action'}>
        {i18n.t('auth.sendAgain')}
      </Button>
    </View>
  );
};
export const containerStyle = ThemedStyles.combine(
  'paddingHorizontal10x',
  'paddingVertical2x',
);

export const textStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'fontL',
  'fontMedium',
  'marginTop4x',
  'textCenter',
);

export default EmailSended;

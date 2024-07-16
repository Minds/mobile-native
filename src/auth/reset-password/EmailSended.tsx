import React from 'react';
import { View } from 'react-native';
import MText from '../../common/components/MText';
import { ResetPasswordStore } from './createLocalStore';
import { Button } from '~/common/ui';
import sp from '~/services/serviceProvider';
type PropsType = {
  store: ResetPasswordStore;
};

const CText = ({ children }) => <MText style={textStyle}>{children}</MText>;
const EmailSended = ({ store }: PropsType) => {
  return (
    <View style={containerStyle}>
      <CText>{sp.i18n.t('auth.emailSent')}</CText>
      <CText>{sp.i18n.t('auth.followInstuctions')}</CText>
      <Button onPress={store.sendEmail} vertical="L2" type={'action'}>
        {sp.i18n.t('auth.sendAgain')}
      </Button>
    </View>
  );
};
export const containerStyle = sp.styles.combine(
  'paddingHorizontal10x',
  'paddingVertical2x',
);

export const textStyle = sp.styles.combine(
  'colorSecondaryText',
  'fontL',
  'fontMedium',
  'marginTop4x',
  'textCenter',
);

export default EmailSended;

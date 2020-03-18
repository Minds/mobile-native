import React, { useCallback, useState, useEffect } from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import Input from '../../common/components/Input';
import twoFactorAuthenticationService from '../../common/services/two-factor-authentication.service';
import CenteredLoading from '../../common/components/CenteredLoading';

export default function() {
  const CS = ThemedStyles.style;

  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState();
  const [TFAConfirmed, setTFAConfirmed] = useState(false);
 
  useEffect(() => {
    async function get2FA() {
      const { telno } = await twoFactorAuthenticationService.has();
      if (telno) {
        setPhoneNumber(telno);
        setTFAConfirmed(true);
      }
      
      setLoading(false);
    }
    get2FA();
  }, [setPhoneNumber, setTFAConfirmed, setLoading]);

  const component = loading 
    ? <CenteredLoading />
    : (
      <View style={[CS.flexContainer, CS.backgroundPrimary]}>
      <Text style={[CS.marginLeft, CS.colorSecondaryText, CS.fontM]}>{i18n.t('settings.TFAdescription')}</Text>
      <View style={[CS.paddingTop4x, CS.paddingHorizontal2x]}>
        <Input
            placeholder={i18n.t('onboarding.infoMobileNumber')}
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            info={i18n.t('onboarding.phoneNumberTooltip')}
            editable={true}
            inputType={'phoneInput'}
            TFA={true}
            TFAConfirmed={TFAConfirmed}
          />
      </View>
    </View>
    );
  return (component);
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
}
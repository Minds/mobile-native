import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from '../../locales';
import {
  useDeviceLogin,
  // useRegisterDevice,
  // useGetCredentials,
} from './login.logic';

// type LoginType = {
//   username: string;
//   passcode: string;
// };
export function LoginScreen(): React.ReactElement {
  // const usernameRef = useRef(null);
  // const passcodeRef = useRef(null);
  // const formProps = useForm<LoginType>({
  //   mode: 'onChange',
  // });
  // const { formState, handleSubmit } = formProps;

  const navigation = useNavigation();
  // const modal = useAlertModal();
  const { t } = useTranslation();
  const { deviceLogin } = useDeviceLogin();
  // const { checkDeviceAvailability } = useRegisterDevice();

  // const { deviceKey, partyKey, isNewDevice } = useGetCredentials();

  /**
   * Replace below for fast login for debugging
   */

  React.useEffect(() => {
    // deviceLogin(findUserByName('Paul'));
  }, [deviceLogin]);

  const onReset = () => navigation.navigate('Reset');

  // const onLogin = async ({ username, passcode }: LoginType) => {
  //   if (!isNewDevice) {
  //     const isSuccessfulLogin = await deviceLogin({
  //       username: partyKey ? partyKey : '',
  //       passcode,
  //       deviceKey,
  //     });

  //     if (isSuccessfulLogin) {
  //       // await appStorage.setLoginUser(partyKey ? partyKey : '', passcode);
  //     }

  //     return isSuccessfulLogin;
  //   }
  //   const isValid = await checkDeviceAvailability({
  //     username,
  //     passcode,
  //     deviceKey,
  //   });
  //   if (!isValid) {
  //     // modal.show({
  //     //   title: t('Oh no'),
  //     //   message: t('Error - wrong credentials'),
  //     // });
  //     return;
  //   }
  //   navigation.navigate('RegisterDevice');
  // };

  return (
    <View>
      <Text testID="sign-in-text">{t('Sign in')}</Text>
      <View />
      {/* {isNewDevice && (
        <InputUsername
          {...{ ...formProps, theRef: usernameRef, nextRef: passcodeRef }}
        />
      )} */}
      {/* <InputPasscode
        {...{
          ...formProps,
          theRef: passcodeRef,
          onSubmitEditing: handleSubmit(onLogin),
        }}
      /> */}
      <View style={[]}>
        <Text>{t('Forgotten details?')} </Text>
        <Button title="" onPress={onReset}>
          {t('Reset')}
        </Button>
      </View>
    </View>
  );
}

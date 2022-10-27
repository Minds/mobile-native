import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ScrollView, Text, View } from 'react-native';
// import { Input, Text, Link, ScreenWrapper, Button, Icon } from 'components/.';
// import { globalStyles } from 'styles/.';
// import { useTranslation } from 'modules/locales';

// import { Modal, Card } from '@ui-kitten/components';
// import appStorage from 'services/appStorage';
// import { useAlertModal } from 'services/hooks/modal';
import {
  useRequestOtpForDeviceChange,
  useVerifyOtpForDeviceChange,
} from './registerDevice.logic';
// import { useNavigation } from 'services/hooks/navigation';

export function VerifyOtpScreen(): JSX.Element {
  // const navigation = useNavigation();
  // const modal = useAlertModal();
  const { t } = useTranslation('mainModule');
  const { requestOtp } = useRequestOtpForDeviceChange();
  const { verifyOtp } = useVerifyOtpForDeviceChange();
  const [otp] = useState('454545');
  // const [modalVisible, setModalVisible] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const onPressResend = useCallback(async () => {
    const sent = await requestOtp();
    setVerificationId(sent);
  }, [requestOtp]);
  // const onCloseModal = () => {
  //   setModalVisible(false);
  //   navigation.navigate('Login');
  // };

  useEffect(() => {
    onPressResend();
  }, [onPressResend]);

  const onPressNext = async () => {
    const partykey = await verifyOtp({ otp, verificationId });
    if (!partykey) {
      // modal.show({
      //   title: t('Oh no'),
      //   message: t('Error registration unsuccessful'),
      // });
      return;
    }
    // appStorage.setPartyKey(partykey);

    // setModalVisible(true);
  };
  // const largeFont = { textStyle: { fontSize: 20 } };

  return (
    <ScrollView scrollEnabled={false}>
      <Text>{t('Enter the 6-digit code')}</Text>
      <View />
      <Text>{t('We have sent an SMS')}</Text>
      <View />
      {/* <Modal
        visible={modalVisible}
        style={[globalStyles.container, globalStyles.paddingHorizontal]}>
        <Card disabled={true}>
          <Text
            style={[globalStyles.marginBottomBase, globalStyles.centerText]}
            category={'h5'}>
            {t('Registration Successful. Please use your passcode to login.')}
          </Text>
          <View style={globalStyles.center}>
            <Button onPress={onCloseModal}>{t('Ok')}</Button>
          </View>
        </Card>
      </Modal> */}
      {/* <Input
        size="large"
        status="basic"
        testID="input-otp-field"
        style={globalStyles.marginTopSmall}
        value={otp}
        keyboardType={'number-pad'}
        returnKeyType={'next'}
        autoFocus
        onChangeText={setOtp}
        onSubmitEditing={onPressNext}
        accessoryRight={props => <Icon {...props} name="email" />}
        {...largeFont}
      /> */}
      {/* <Link onPress={onPressResend}>{t('Re-send code')}</Link>
      <Link onPress={() => navigation.goBack()}>
        {t('Re-enter mobile number')}
      </Link> */}
      <View style={[]} />
      <View style={[]}>
        <Button title="" testID="submit-button" onPress={onPressNext}>
          {t('Submit')}
        </Button>
      </View>
    </ScrollView>
  );
}

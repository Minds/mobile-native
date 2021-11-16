import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import InputNumber from './partials/InputNumber';
import ThemedStyles from '../../../../styles/ThemedStyles';
import usePhoneValidationStore from './usePhoneValidationStore';
import ConfirmNumber from './partials/ConfirmNumber';

type PropsType = {};

const PhoneValidationComponent = observer(({}: PropsType) => {
  const theme = ThemedStyles.style;
  const store = usePhoneValidationStore();

  return (
    <View style={theme.flexContainer}>
      {store?.haveToInputNumber && <InputNumber />}
      {store?.haveToConfirm && <ConfirmNumber />}
    </View>
  );
});

export default PhoneValidationComponent;

import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import InputNumber from './partials/InputNumber';

import usePhoneValidationStore from './usePhoneValidationStore';
import ConfirmNumber from './partials/ConfirmNumber';
import sp from '~/services/serviceProvider';

type PropsType = {};

const PhoneValidationComponent = observer(({}: PropsType) => {
  const theme = sp.styles.style;
  const store = usePhoneValidationStore();

  return (
    <View style={theme.flexContainer}>
      {store?.haveToInputNumber && <InputNumber />}
      {store?.haveToConfirm && <ConfirmNumber />}
    </View>
  );
});

export default PhoneValidationComponent;

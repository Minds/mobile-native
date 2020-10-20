import React, { useEffect } from 'react';

import { View, Text, StyleSheet, TextInputProps } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';
import stylesheet from '../../../onboarding/stylesheet';
import { BottomOptionsStoreType } from '../BottomOptionPopup';
import NumberConfirmed from './partials/NumberConfirmed';
import InputNumber from './partials/InputNumber';
import ConfirmNumber from './partials/ConfirmNumber';
import createLocalStore, { PhoneValidationStoreType } from './createLocalStore';

export type PhoneValidationPropsType = {
  TFA?: any;
  TFAConfirmed?: boolean;
  bottomStore?: BottomOptionsStoreType;
  inputStyles?: any;
  onNext?: Function;
  textStyle?: any;
  localStore?: PhoneValidationStoreType;
} & TextInputProps;

const PhoneValidationComponent = observer((props: PhoneValidationPropsType) => {
  const localStore = props.localStore || useLocalStore(createLocalStore);

  useEffect(() => {
    localStore.setTFAConfirmed(
      Boolean(props.TFAConfirmed && props.TFAConfirmed === true),
    );
  }, [localStore, props.TFAConfirmed]);

  const getFormPartial = () => {
    if (localStore.TFAConfirmed) {
      return <NumberConfirmed localStore={localStore} {...props} />;
    } else if (!localStore.confirming) {
      return <InputNumber localStore={localStore} {...props} />;
    } else if (!localStore.confirmed) {
      return <ConfirmNumber localStore={localStore} {...props} />;
    } else {
      return <NumberConfirmed localStore={localStore} {...props} />;
    }
  };

  return (
    <View>
      <View>{getFormPartial()}</View>
      {!!localStore.error && (
        <View>
          <Text style={style.error}>{localStore.error}</Text>
        </View>
      )}
    </View>
  );
});

export default PhoneValidationComponent;

const style = StyleSheet.create(stylesheet);

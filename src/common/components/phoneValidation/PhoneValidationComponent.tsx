import React, { forwardRef, useEffect, useRef } from 'react';

import { View, Text, StyleSheet, TextInputProps } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';
import stylesheet from '../../../onboarding/stylesheet';
import { BottomOptionsStoreType } from '../BottomOptionPopup';
import NumberConfirmed from './partials/NumberConfirmed';
import InputNumber from './partials/InputNumber';
import { useLegacyStores, useStores } from '../../hooks/__mocks__/use-stores';
import ConfirmNumber from './partials/ConfirmNumber';
import createLocalStore from './createLocalStore';

export type PhoneValidationPropsType = {
  TFA?: any;
  TFAConfirmed?: boolean;
  bottomStore?: BottomOptionsStoreType;
  inputStyles?: any;
  onNext?: Function;
  textStyle?: any;
} & TextInputProps;

const PhoneValidationComponent = observer(
  forwardRef((props: PhoneValidationPropsType) => {
    const localStore = useLocalStore(createLocalStore);
    const numberInput = useRef<any>(null);
    const confirmNumber = useRef<any>(null);

    const wallet = useStores().wallet;
    const user = useLegacyStores().user;

    useEffect(() => {
      localStore.setTFAConfirmed(
        Boolean(props.TFAConfirmed && props.TFAConfirmed === true),
      );
    }, [localStore, props.TFAConfirmed]);

    const getFormPartial = () => {
      if (localStore.TFAConfirmed) {
        return <NumberConfirmed localStore={localStore} {...props} />;
      } else if (!localStore.confirming) {
        return (
          <InputNumber
            localStore={localStore}
            wallet={wallet}
            ref={numberInput}
            {...props}
          />
        );
      } else if (!localStore.confirmed) {
        return (
          <ConfirmNumber
            localStore={localStore}
            wallet={wallet}
            user={user}
            ref={confirmNumber}
            {...props}
          />
        );
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
  }),
);

export default PhoneValidationComponent;

const style = StyleSheet.create(stylesheet);

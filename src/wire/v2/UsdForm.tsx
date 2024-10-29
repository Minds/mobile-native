import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, ScrollView } from 'react-native';

import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import { styles } from './TokensForm';
import InputContainer from '../../common/components/InputContainer';
import MText from '../../common/components/MText';
import StripeCardSelector from '../../common/components/stripe-card-selector/StripeCardSelector';
import { IS_FROM_STORE } from '~/config/Config';
import sp from '~/services/serviceProvider';

type propsType = {
  store: FabScreenStore;
};

const UsdForm = observer(({ store }: propsType) => {
  const theme = sp.styles.style;

  useEffect(() => {
    store.getLastAmount();
  }, [store]);

  return (
    <View>
      <InputContainer
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={'USD'}
        onChangeText={store.setAmount}
        value={store.amount.toString()}
        keyboardType="decimal-pad"
        testID="fabTokensInput"
      />
      <View style={theme.paddingHorizontal4x}>
        <ScrollView contentContainerStyle={scrollviewStyle}>
          {!IS_FROM_STORE && (
            <StripeCardSelector onCardSelected={store.setCard} />
          )}
        </ScrollView>

        <LabeledComponent label="Repeat Payment Monthly">
          <CheckBox
            containerStyle={[theme.checkbox, styles.checkbox]}
            title={<MText style={textStyle}>Repeat ?</MText>}
            checked={store.wire.recurring}
            onPress={store.setRepeat}
          />
        </LabeledComponent>
      </View>
    </View>
  );
});

const scrollviewStyle = sp.styles.combine('paddingTop2x');

const textStyle = sp.styles.combine(
  'colorPrimaryText',
  'fontMedium',
  'paddingLeft',
  'fontL',
);

export default UsdForm;

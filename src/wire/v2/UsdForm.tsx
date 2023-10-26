import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, ScrollView } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import { styles } from './TokensForm';
import InputContainer from '../../common/components/InputContainer';
import MText from '../../common/components/MText';
import StripeCardSelector from '../../common/components/stripe-card-selector/StripeCardSelector';
import { IS_FROM_STORE } from '~/config/Config';

type propsType = {
  store: FabScreenStore;
};

const UsdForm = observer(({ store }: propsType) => {
  const theme = ThemedStyles.style;

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

const scrollviewStyle = ThemedStyles.combine('paddingTop2x');

const textStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'fontMedium',
  'paddingLeft',
  'fontL',
);

export default UsdForm;

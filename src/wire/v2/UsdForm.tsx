import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Input from '../../common/components/Input';
import ThemedStyles from '../../styles/ThemedStyles';
import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import StripeCardSelector from '../methods/StripeCardSelector';

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
      <Input
        labelStyle={styles.label}
        style={[theme.marginBottom2x, styles.input]}
        placeholder={'USD'}
        onChangeText={store.setAmount}
        value={store.amount.toString()}
        testID="fabTokensInput"
        keyboardType="decimal-pad"
      />

      <LabeledComponent label="Select Card" wrapperStyle={theme.marginBottom4x}>
        <ScrollView
          contentContainerStyle={[
            theme.paddingLeft2x,
            theme.paddingRight2x,
            theme.columnAlignCenter,
            theme.alignCenter,
            theme.flexContainer,
            theme.paddingTop2x,
          ]}>
          <StripeCardSelector onCardSelected={store.setCard} />
        </ScrollView>
      </LabeledComponent>

      <LabeledComponent label="Repeat Payment Monthly">
        <CheckBox
          containerStyle={[theme.checkbox, styles.checkbox]}
          title={<Text style={[theme.colorPrimaryText]}>Repeat ?</Text>}
          checked={store.wire.recurring}
          onPress={store.setRepeat}
        />
      </LabeledComponent>
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 10,
  },
  input: {
    height: 30,
    padding: 0,
    paddingLeft: 10,
  },
  checkbox: {
    marginRight: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default UsdForm;

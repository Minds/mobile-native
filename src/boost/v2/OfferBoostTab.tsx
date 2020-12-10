import { observer } from 'mobx-react';
import React from 'react';
import { Text, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { BoostStoreType } from './createBoostStore';

type PropsType = {
  localStore: BoostStoreType;
};

const OfferBoostTab = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View>
      <Text>offers</Text>
    </View>
  );
});

export default OfferBoostTab;

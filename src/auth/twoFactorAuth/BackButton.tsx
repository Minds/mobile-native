import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../styles/ThemedStyles';
import { TwoFactorStore } from './createTwoFactorStore';

type PropsType = {
  store: TwoFactorStore;
};

const BackButton = observer(({ store }: PropsType) => {
  if (store.twoFactorAuthStep === 'login') {
    return null;
  }
  const theme = ThemedStyles.style;
  return (
    <TouchableOpacity
      onPress={store.handleBackButton}
      style={[theme.marginTop, theme.padding2x]}>
      <Icon color="#B8C1CA" size={32} name="chevron-left" />
    </TouchableOpacity>
  );
});

export default BackButton;

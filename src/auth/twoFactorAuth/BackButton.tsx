import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TwoFactorStore } from './createTwoFactorStore';

type PropsType = {
  store: TwoFactorStore;
};

const BackButton = observer(({ store }: PropsType) => {
  if (store.twoFactorAuthStep === 'login') {
    return null;
  }
  return (
    <TouchableOpacity onPress={store.handleBackButton}>
      <Icon color="#B8C1CA" size={28} name="chevron-left" />
    </TouchableOpacity>
  );
});

export default BackButton;

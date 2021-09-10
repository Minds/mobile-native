import React from 'react';

import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { TwoFactorStore } from '../twoFactorAuth/createTwoFactorStore';
import { observer, useLocalStore } from 'mobx-react';
import ResetPasswordModal, {
  ResetPasswordModalHandles,
} from '../reset-password/ResetPasswordModal';
import { LoginScreenRouteProp } from './LoginScreen';
import createLoginStore from './createLoginStore';
import AnimatableText from './AnimatableText';
import LoginInputs from './LoginInputs';
import LoginButtons from './LoginButtons';

type PropsType = {
  onLogin?: Function;
  onRegisterPress?: () => void;
  store: TwoFactorStore;
  route: LoginScreenRouteProp;
  multiUser?: boolean;
};

export default observer(function LoginForm(props: PropsType) {
  const resetRef = React.useRef<ResetPasswordModalHandles>(null);
  const localStore = useLocalStore(createLoginStore, { props, resetRef });

  const username = props.route?.params?.username;
  const code = props.route?.params?.code;
  React.useEffect(() => {
    const navToInputPassword = username && code && !!resetRef.current;
    if (navToInputPassword) {
      resetRef.current!.show(navToInputPassword, username, code);
    }
  }, [code, username]);

  const theme = ThemedStyles.style;

  return (
    <View style={theme.flexContainer}>
      <AnimatableText msg={localStore.msg} />
      <LoginInputs localStore={localStore} multiUser={props.multiUser} />
      <LoginButtons
        localStore={localStore}
        multiUser={props.multiUser}
        onRegisterPress={props.onRegisterPress}
      />
      <ResetPasswordModal ref={resetRef} />
    </View>
  );
});

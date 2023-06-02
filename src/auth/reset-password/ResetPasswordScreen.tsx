import { StackScreenProps } from '@react-navigation/stack';
import { observer, useLocalStore } from 'mobx-react';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { RootStackParamList } from '~/navigation/NavigationTypes';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
import ThemedStyles from '~/styles/ThemedStyles';
import createLocalStore from './createLocalStore';
import EmailSended from './EmailSended';
import InputPassword from './InputPassword';
import InputUser from './InputUser';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type ResetPasswordScreenPropsType = {
  navigation: any;
} & StackScreenProps<RootStackParamList, 'ResetPassword'>;

export interface ResetPasswordScreenHandles {
  show(inputPassword?: boolean, username?: string, code?: string): void;
}

const ResetPasswordScreen: FC<ResetPasswordScreenPropsType> = ({
  navigation,
  route,
}) => {
  const store = useLocalStore(createLocalStore);
  const username = route.params?.username;
  const code = route.params?.code;

  useEffect(() => {
    if (username && code) {
      store.navToInputPassword(username!, code!);
    } else {
      store.navToInputUser();
    }
  }, [code, store, username]);

  let step;
  switch (store.currentStep) {
    case 'inputUser':
      step = <InputUser store={store} />;
      break;
    case 'emailSended':
      step = <EmailSended store={store} />;
      break;
    case 'inputPassword':
      step = (
        <InputPassword store={store} onFinish={() => navigation.goBack()} />
      );
      break;
  }

  return (
    <ModalContainer
      title={store.title}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={modalContainerStyle}>
      <View style={containerStyle}>{step}</View>
    </ModalContainer>
  );
};
const modalContainerStyle = ThemedStyles.combine(
  'bgPrimaryBackgroundHighlight',
  'alignSelfCenterMaxWidth',
);

const containerStyle = ThemedStyles.combine(
  'paddingTop2x',
  'borderTop',
  'bcolorPrimaryBorder',
  'bgPrimaryBackground',
);

export default withErrorBoundaryScreen(observer(ResetPasswordScreen));

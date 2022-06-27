import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { BottomSheetModal } from '~/common/components/bottom-sheet';
import { BottomSheetModal as GorhomBottomSheet } from '@gorhom/bottom-sheet';
import createLocalStore from './createLocalStore';
import EmailSended from './EmailSended';
import InputPassword from './InputPassword';
import InputUser from './InputUser';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {};

export interface ResetPasswordModalHandles {
  show(inputPassword?: boolean, username?: string, code?: string): void;
}

const ResetPasswordModal: React.ForwardRefRenderFunction<
  ResetPasswordModalHandles,
  PropsType
> = ({}: PropsType, ref) => {
  const modalRef = React.useRef<GorhomBottomSheet>(null);
  const store = useLocalStore(createLocalStore);
  React.useImperativeHandle(ref, () => ({
    show: (inputPassword?: boolean, username?: string, code?: string) => {
      if (modalRef.current) {
        if (inputPassword) {
          store.navToInputPassword(username!, code!);
        } else {
          store.navToInputUser();
        }

        modalRef.current.present();
      }
    },
  }));
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
        <InputPassword
          store={store}
          onFinish={() => modalRef.current?.close()}
        />
      );
      break;
  }
  return (
    <BottomSheetModal
      ref={modalRef}
      title={store.title}
      onBack={
        store.currentStep === 'emailSended' ? store.navToInputUser : undefined
      }
      onDismiss={() => modalRef.current?.close()}
      fixedContentHeight
      snapPoints={['90%']}>
      <View style={containerStyle}>{step}</View>
    </BottomSheetModal>
  );
};

const containerStyle = ThemedStyles.combine(
  'paddingTop2x',
  'borderTop',
  'bcolorPrimaryBorder',
  'bgPrimaryBackground',
  {
    height: '150%',
  },
);

export default observer(React.forwardRef(ResetPasswordModal));

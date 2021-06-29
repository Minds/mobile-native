import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import BottomModal, {
  BottomModalHandles,
} from '../../common/components/bottom-modal/BottomModal';
import createLocalStore from './createLocalStore';
import EmailSended from './EmailSended';
import InputPassword from './InputPassword';
import InputUser from './InputUser';

type PropsType = {};

export interface ResetPasswordModalHandles {
  show(inputPassword?: boolean, username?: string, code?: string): void;
  setError(error: string);
}

const ResetPasswordModal: React.ForwardRefRenderFunction<
  ResetPasswordModalHandles,
  PropsType
> = ({}: PropsType, ref) => {
  const modalRef = React.useRef<BottomModalHandles>(null);
  const store = useLocalStore(createLocalStore, { ref: modalRef });
  React.useImperativeHandle(ref, () => ({
    show: (inputPassword?: boolean, username?: string, code?: string) => {
      if (modalRef.current) {
        if (inputPassword) {
          store.navToInputPassword(username!, code!);
        } else {
          store.navToInputUser();
        }
        modalRef.current.store.show();
      }
    },
    setError: (error: string) => {
      if (modalRef.current) {
        modalRef.current.store.setError(error);
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
          onFinish={() => modalRef.current?.store.hide()}
        />
      );
      break;
  }
  return (
    <BottomModal
      ref={modalRef}
      title={store.title}
      showBackButton={store.currentStep === 'emailSended'}
      onPressBack={store.navToInputUser}>
      {step}
    </BottomModal>
  );
};

export default observer(React.forwardRef(ResetPasswordModal));

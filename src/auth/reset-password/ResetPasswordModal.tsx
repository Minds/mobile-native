import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import { View, Text } from 'react-native';
import BottomModal, {
  BottomModalHandles,
} from '../../common/components/bottom-modal/BottomModal';
import createLocalStore from './createLocalStore';
import InputUser from './InputUser';

type PropsType = {};

export interface ResetPasswordModalHandles {
  show(): void;
}

const ResetPasswordModal: React.ForwardRefRenderFunction<
  ResetPasswordModalHandles,
  PropsType
> = ({}: PropsType, ref) => {
  const store = useLocalStore(createLocalStore);
  const modalRef = React.useRef<BottomModalHandles>(null);
  React.useImperativeHandle(ref, () => ({
    show: () => {
      if (modalRef.current) {
        modalRef.current.show();
      }
    },
  }));
  return (
    <BottomModal
      ref={modalRef}
      title={store.title}
      showBackButton={store.currentStep === 'emailSended'}
      onPressBack={store.navToInputUser}>
      <InputUser store={store} />
    </BottomModal>
  );
};

export default observer(React.forwardRef(ResetPasswordModal));

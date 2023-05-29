import { useLocalStore } from 'mobx-react';
import React from 'react';
import createPhoneValidationStore, {
  PhoneValidationStore,
} from './createPhoneValidationStore';
export const PhoneValidationContext =
  React.createContext<PhoneValidationStore | null>(null);

type PropsType = {
  onConfirm: Function;
  onCancel: Function;
  description?: string | undefined;
  children: React.ReactElement<{}>;
};

export const PhoneValidationProvider = ({ children, ...props }: PropsType) => {
  const store = useLocalStore(createPhoneValidationStore, { ...props });

  return (
    <PhoneValidationContext.Provider value={store}>
      {children}
    </PhoneValidationContext.Provider>
  );
};

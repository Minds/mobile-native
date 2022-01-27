import React from 'react';
import { PhoneValidationContext } from './PhoneValidationProvider';

const usePhoneValidationStore = () => {
  const phoneValidationStore = React.useContext(PhoneValidationContext);
  return phoneValidationStore;
};

export default usePhoneValidationStore;

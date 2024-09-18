import React from 'react';
import { observer } from 'mobx-react';

import ModalScreen from '~/common/components/ModalScreen';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { B1 } from '~/common/ui';
import sp from '~/services/serviceProvider';
//TODO: remove
const Withdrawal = observer(() => {
  return (
    <ModalScreen
      source={require('~/assets/withdrawalbg.jpg')}
      title={sp.i18n.t('wallet.transferToOnchain')}>
      <B1>This functionality is disabled</B1>
    </ModalScreen>
  );
});

export default withErrorBoundaryScreen(Withdrawal, 'Withdrawal');

import React from 'react';
import { observer } from 'mobx-react';

import ModalScreen from '~/common/components/ModalScreen';
import i18n from '~/common/services/i18n.service';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { B1 } from '~/common/ui';

//TODO: remove
const Withdrawal = observer(() => {
  return (
    <ModalScreen
      source={require('~/assets/withdrawalbg.jpg')}
      title={i18n.t('wallet.transferToOnchain')}>
      <B1>This functionality is disabled</B1>
    </ModalScreen>
  );
});

export default withErrorBoundaryScreen(Withdrawal, 'Withdrawal');

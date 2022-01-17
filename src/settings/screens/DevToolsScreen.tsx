import React, { useState } from 'react';
import InputContainer from '~/common/components/InputContainer';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import { storages } from '~/common/services/storage/storages.service';
import { Screen } from '~/common/ui';

export const EXPERIMENTS_ID = 'experiments_id';

const DevToolsScreen = () => {
  const [experimentsId, setExperimentsId] = useState(
    storages.app.getString(EXPERIMENTS_ID) || '',
  );
  const storeExperimentsId = useDebouncedCallback(
    xpId => {
      storages.app.setString(EXPERIMENTS_ID, xpId);
    },
    500,
    [],
  );

  return (
    <Screen>
      <InputContainer
        placeholder={'Experiments Id'}
        onChangeText={text => {
          setExperimentsId(text);
          storeExperimentsId(text);
        }}
        value={experimentsId}
      />
    </Screen>
  );
};

export default DevToolsScreen;

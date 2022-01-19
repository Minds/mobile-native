import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import InputContainer from '~/common/components/InputContainer';
import Toggle from '~/common/components/Toggle';
import useDebouncedCallback from '~/common/hooks/useDebouncedCallback';
import { storages } from '~/common/services/storage/storages.service';
import { B1 } from '~/common/ui';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
import ThemedStyles from '~/styles/ThemedStyles';

const DevToolsScreen = () => {
  const navigation = useNavigation();
  const [experimentsId, setExperimentsId] = useState(
    storages.app.getString('experiments_id') || '',
  );
  const [staging, setStaging] = useState(
    storages.app.getBool('staging') || false,
  );
  const [canary, setCanary] = useState(storages.app.getBool('canary') || false);

  const setStringDebounced = useDebouncedCallback(
    storages.app.setString,
    500,
    [],
  );

  const theme = ThemedStyles.style;

  return (
    <ModalContainer
      title={'Developer Options'}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      titleStyle={theme.colorPrimaryText}>
      <View style={rowStyle}>
        <B1 left="M">Staging</B1>
        <Toggle
          value={staging}
          onValueChange={val => {
            setStaging(val);
            storages.app.setBool('staging', val);
          }}
        />
      </View>
      <View style={rowStyle}>
        <B1 left="M">Canary</B1>
        <Toggle
          value={canary}
          onValueChange={val => {
            setCanary(val);
            storages.app.setBool('canary', val);
          }}
        />
      </View>
      <InputContainer
        placeholder={'Experiments Id'}
        onChangeText={text => {
          setExperimentsId(text);
          setStringDebounced(EXPERIMENTS_ID, text);
        }}
        value={experimentsId}
      />
    </ModalContainer>
  );
};

const rowStyle = ThemedStyles.combine({
  paddingVertical: 20,
  paddingLeft: 5,
  paddingRight: 15,
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
});

export default DevToolsScreen;

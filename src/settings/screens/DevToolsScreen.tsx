import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import FitScrollView from '~/common/components/FitScrollView';
import Toggle from '~/common/components/Toggle';
import { storages } from '~/common/services/storage/storages.service';
import { B1, B2, H3, Row, ScreenSection } from '~/common/ui';
import { CANARY_KEY, STAGING_KEY } from '~/config/Config';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
import ThemedStyles from '~/styles/ThemedStyles';
import GrowthbookDev from '../components/GrowthbookDev';

const DevToolsScreen = () => {
  const navigation = useNavigation();
  const [staging, setStaging] = useState(
    storages.app.getBool(STAGING_KEY) || false,
  );
  const [canary, setCanary] = useState(
    storages.app.getBool(CANARY_KEY) || false,
  );

  const theme = ThemedStyles.style;

  return (
    <ModalContainer
      title={'Developer Options'}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      titleStyle={theme.colorPrimaryText}>
      <FitScrollView>
        <ScreenSection vertical="M">
          <H3>Server</H3>
          <Row align="centerBetween" vertical="L">
            <B1>Staging</B1>
            <Toggle
              value={staging}
              onValueChange={val => {
                setStaging(val);
                storages.app.setBool(STAGING_KEY, val);
              }}
            />
          </Row>
          <Row align="centerBetween" vertical="L">
            <B1>Canary</B1>
            <Toggle
              value={canary}
              onValueChange={val => {
                setCanary(val);
                storages.app.setBool(CANARY_KEY, val);
              }}
            />
          </Row>
          <B2 align="center" color="tertiary">
            Requires restart
          </B2>
        </ScreenSection>
        <GrowthbookDev />
      </FitScrollView>
    </ModalContainer>
  );
};

export default DevToolsScreen;

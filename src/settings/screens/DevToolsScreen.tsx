import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Clipboard from 'expo-clipboard';

import FloatingInput from '~/common/components/FloatingInput';
import Toggle from '~/common/components/Toggle';
import { B1, B2, Button, Column, H3, Row, ScreenSection } from '~/common/ui';
import { CANARY_KEY, STAGING_KEY } from '~/config/Config';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
// import { CodePushDebugger, codePush } from 'modules/codepush';
import GrowthbookDev from '../components/GrowthbookDev';
// import Link from '../../common/components/Link';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { showNotification } from 'AppMessages';
import sp from '~/services/serviceProvider';

const DevToolsScreen = () => {
  const pushService = sp.resolve('push');
  const navigation = useNavigation();
  const [apiURL, setApi] = useState(sp.resolve('devMode').getApiURL());
  const [staging, setStaging] = useState(
    sp.storages.app.getBoolean(STAGING_KEY) || false,
  );
  const [canary, setCanary] = useState(
    sp.storages.app.getBoolean(CANARY_KEY) || false,
  );
  const inputRef = React.useRef<any>();
  const theme = sp.styles.style;

  const setApiURLCallback = () => {
    if (sp.resolve('devMode').setApiURL(apiURL || '')) {
      inputRef.current?.hide();
    }
  };

  const requestPushNote = () => {
    const token = sp.resolve('push').getToken();
    const platform = Platform.OS;
    const payload = {
      token,
      platform,
      title: 'title',
      body: 'body',
      uri: 'https://www.minds.com/',
      icon_url:
        'https://cdn.minds.com/fs/v1/thumbnail/1605257830766481421/xlarge/',
      media_url:
        'https://cdn.minds.com/fs/v1/thumbnail/1605257830766481421/xlarge/',
    };
    sp.api
      .post('api/v3/notifications/push/manual-send', payload)
      .then(response => {
        console.log(response);
        showNotification('Sent request for push notification');
      })
      .catch(err => {
        console.log(JSON.stringify(err, null, 2));
        showNotification(
          'Failed to send request for push notification',
          'danger',
        );
      });
  };

  return (
    <ModalContainer
      title={'Developer Options'}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={[
        theme.bgPrimaryBackgroundHighlight,
        theme.alignSelfCenterMaxWidth,
      ]}
      titleStyle={theme.colorPrimaryText}>
      <ScrollView testID="DevToolsScreen">
        <ScreenSection vertical="M">
          <H3>Server</H3>
          <Row align="centerBetween" vertical="L">
            <B1>Staging</B1>
            <Toggle
              value={staging}
              onValueChange={val => {
                setStaging(val);
                sp.storages.app.set(STAGING_KEY, val);
              }}
            />
          </Row>
          <Row align="centerBetween" vertical="L">
            <B1>Canary</B1>
            <Toggle
              value={canary}
              onValueChange={val => {
                setCanary(val);
                sp.storages.app.set(CANARY_KEY, val);
              }}
            />
          </Row>
          <Row align="centerBetween" vertical="L">
            <Column>
              <B1>API URL</B1>
              {apiURL ? (
                <B2 color="link">{apiURL}</B2>
              ) : (
                <B2 color="tertiary">Default</B2>
              )}
              <FloatingInput
                ref={inputRef}
                autoCapitalize="none"
                keyboardType="url"
                onCancel={() => setApi(sp.resolve('devMode').getApiURL())}
                onSubmitEditing={setApiURLCallback}
                defaultValue={apiURL || 'https://'}
                onChangeText={v => setApi(v)}
              />
            </Column>
            <Button
              size="small"
              onPress={() => inputRef.current?.show()}
              type="action">
              Change
            </Button>
          </Row>

          <B2 align="center" color="tertiary">
            Requires Restart
          </B2>
          <Row align="centerBetween" vertical="L">
            <B1>Push Notifications</B1>
            <Button
              size="small"
              disabled={!pushService.getToken()}
              onPress={() => {
                Clipboard.setStringAsync(pushService.getToken());
                showNotification('Token copied to the clipboard');
              }}
              type="action">
              Copy Token
            </Button>
          </Row>
          <Row align="centerBetween" vertical="L">
            <B1>Send Test Push Notifications</B1>
            <Button
              disabled={!pushService.getToken()}
              size="small"
              onPress={requestPushNote}
              type="action">
              Send Note
            </Button>
          </Row>
        </ScreenSection>
        <GrowthbookDev />
      </ScrollView>
    </ModalContainer>
  );
};

export const HiddenTap = ({
  children,
  count,
  ...other
}: PressableProps & {
  children: React.ReactNode;
  count?: number;
}) => {
  const { current: countRef } = React.useRef<{ count: number }>({ count: 0 });
  const devMode = sp.resolve('devMode');

  const setDeveloperMode = (v: boolean) => {
    countRef.count++;
    if (countRef.count > (count || 15)) {
      countRef.count = 0;
      devMode.setDevMode(v);
    }
  };

  return (
    <Pressable onPress={() => setDeveloperMode(!devMode.isActive)} {...other}>
      {children}
    </Pressable>
  );
};

export default withErrorBoundaryScreen(DevToolsScreen, 'DevToolsScreen');

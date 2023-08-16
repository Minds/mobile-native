import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FloatingInput from '~/common/components/FloatingInput';
import Toggle from '~/common/components/Toggle';
import { storages } from '~/common/services/storage/storages.service';
import { B1, B2, Button, Column, H3, Row, ScreenSection } from '~/common/ui';
import {
  CANARY_KEY,
  CUSTOM_API_URL,
  DEV_MODE,
  STAGING_KEY,
} from '~/config/Config';
import ModalContainer from '~/onboarding/v2/steps/ModalContainer';
import ThemedStyles from '~/styles/ThemedStyles';
import { CodePushDebugger, codePush } from 'modules/codepush';
import GrowthbookDev from '../components/GrowthbookDev';
import Link from '../../common/components/Link';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

const DevToolsScreen = () => {
  const navigation = useNavigation();
  const [apiURL, setApi] = useState(CUSTOM_API_URL);
  const [staging, setStaging] = useState(
    storages.app.getBool(STAGING_KEY) || false,
  );
  const [canary, setCanary] = useState(
    storages.app.getBool(CANARY_KEY) || false,
  );
  const inputRef = React.useRef<any>();
  const theme = ThemedStyles.style;

  const setApiURLCallback = () => {
    if (DEV_MODE.setApiURL(apiURL || '')) {
      inputRef.current?.hide();
    }
  };

  const [storyBook, setStoryBook] = useState(
    storages.app.getBool('storybook') || false,
  );

  return (
    <ModalContainer
      title={'Developer Options'}
      onPressBack={navigation.goBack}
      marginTop={20}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
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
          <Row align="centerBetween" vertical="L">
            <Column>
              <B1>API URL</B1>
              {Boolean(apiURL) ? (
                <B2 color="link">{apiURL}</B2>
              ) : (
                <B2 color="tertiary">Default</B2>
              )}
              <FloatingInput
                ref={inputRef}
                onSubmit={setApiURLCallback}
                autoCapitalize="none"
                keyboardType="url"
                onCancel={() => setApi(CUSTOM_API_URL)}
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
          <Row align="centerBetween" vertical="L">
            <B1>StoryBook</B1>
            <Toggle
              value={storyBook}
              onValueChange={val => {
                setStoryBook(val);
                storages.app.setBool('storybook', val);
              }}
            />
          </Row>

          <B2 align="center" color="tertiary">
            Requires <Link onPress={() => codePush.restartApp()}>restart</Link>
          </B2>
        </ScreenSection>
        <CodePushDebugger />
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

  const setDeveloperMode = (v: boolean) => {
    countRef.count++;
    if (countRef.count > (count || 15)) {
      countRef.count = 0;
      DEV_MODE.setDevMode(v);
    }
  };

  return (
    <Pressable onPress={() => setDeveloperMode(!DEV_MODE.isActive)} {...other}>
      {children}
    </Pressable>
  );
};

export default withErrorBoundaryScreen(DevToolsScreen, 'DevToolsScreen');

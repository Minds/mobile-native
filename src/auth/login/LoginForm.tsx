import React, { useRef, useState } from 'react';

import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import createLoginStore from './createLoginStore';
import { Image } from 'expo-image';

import UserModel from '../../channel/UserModel';
import sessionService from '../../common/services/session.service';
import InputContainer, {
  InputContainerImperativeHandle,
} from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import MText from '../../common/components/MText';
import { IS_IOS, IS_IPAD } from '../../config/Config';
import { Button, Row, B1 } from '~ui';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import PasswordInput from '~/common/components/password-input/PasswordInput';
import CookieManager from '@react-native-cookies/cookies';

type PropsType = {
  onLogin?: Function;
  onRegisterPress?: () => void;
  multiUser?: boolean;
  relogin?: boolean;
  sessionIndex?: number;
};
/**
 * Login Form component
 */
export default observer(function LoginForm(props: PropsType) {
  const [token, setToken] = useState('');
  const localStore = useLocalStore(createLoginStore, { props });
  const passwordRef = useRef<InputContainerImperativeHandle>(null);

  const theme = ThemedStyles.style;

  const user = React.useMemo(() => {
    const u =
      props.sessionIndex !== undefined
        ? UserModel.checkOrCreate(
            sessionService.getSessionForIndex(props.sessionIndex).user,
          )
        : sessionService.getUser();

    if (props.relogin && !localStore.username) {
      localStore.username = u.username;
    }
    return u;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sessionIndex, props.relogin, localStore.username]);

  const onLoginPress = () => {
    console.log('onLoginPress', token);
    localStore.onLoginPress(token);
  };

  const usernameInput = props.relogin ? (
    <View style={styles.container}>
      <Image source={user.getAvatarSource('medium')} style={styles.avatar} />
      <View style={styles.nameContainer}>
        <MText style={styles.name}>{user.name}</MText>
        <MText style={styles.username} testID={`username${user.username}`}>
          @{user.username}
        </MText>
      </View>
    </View>
  ) : (
    <InputContainer
      placeholder={i18n.t('auth.username')}
      onChangeText={localStore.setUsername}
      selectionColor={ThemedStyles.getColor('Link')}
      autoComplete="username"
      textContentType="username"
      value={localStore.username}
      testID="usernameLoginInput"
      autoCorrect={false}
      noBottomBorder
      onSubmitEditing={passwordRef.current?.focus}
      keyboardType="default"
      returnKeyLabel={i18n.t('auth.nextLabel')}
      returnKeyType="next"
      maxLength={50}
      error={
        localStore.showErrors && !localStore.username
          ? i18n.t('auth.fieldRequired')
          : undefined
      }
      autoFocus={true}
    />
  );

  return (
    <View style={theme.flexContainer}>
      <DismissKeyboard>
        {usernameInput}
        <View style={theme.marginBottom4x}>
          <PasswordInput
            ref={passwordRef}
            placeholder={i18n.t('auth.password')}
            selectionColor={ThemedStyles.getColor('Link')}
            autoComplete="password"
            textContentType="password"
            onChangeText={localStore.setPassword}
            value={localStore.password}
            testID="userPasswordInput"
            returnKeyLabel={i18n.t('auth.submitLabel')}
            returnKeyType="send"
            autoFocus={props.relogin}
            onSubmitEditing={onLoginPress}
            error={
              localStore.showErrors && !localStore.password
                ? i18n.t('auth.fieldRequired')
                : undefined
            }
          />
        </View>
        <Button
          type="action"
          testID="loginButton"
          spinner
          horizontal="XL"
          top="XXL"
          containerStyle={IS_IPAD ? styles.buttonIpad : styles.button}
          onPress={onLoginPress}>
          {i18n.t('auth.login')}
        </Button>
        <Row top="L2" align="centerBoth">
          <B1 onPress={localStore.onForgotPress}>{i18n.t('auth.forgot')}</B1>
        </Row>
        <HiddenWeb onSetCookie={setToken} />
      </DismissKeyboard>
    </View>
  );
});

const styles = ThemedStyles.create({
  name: ['bold', 'fontXL'],
  username: ['fontMedium', 'fontM'],
  forgotText: ['colorPrimaryText', 'fontL', 'textCenter'],
  container: [
    'rowJustifyCenter',
    'padding4x',
    'bcolorPrimaryBorder',
    'borderTopHair',
    'bgPrimaryBackground',
  ],
  nameContainer: ['flexContainerCenter', 'paddingLeft', 'justifyCenter'],
  avatar: [
    {
      height: 40,
      width: 40,
      borderRadius: 20,
    },
    'bgTertiaryBackground',
  ],
  icon: [
    {
      position: 'absolute',
      right: 12,
      top: IS_IOS ? 30 : 33,
    },
    'colorSecondaryText',
  ],
  buttonIpad: {
    width: '45%',
    alignSelf: 'center',
  },
  button: {
    alignSelf: 'stretch',
  },
});

type WebProps = {
  onSetCookie: (cookie: string) => void;
};

const HiddenWeb = ({ onSetCookie }: WebProps) => {
  const WebView = require('react-native-webview').WebView;
  return (
    <WebView
      source={{ uri: 'https://www.minds.com/login' }}
      // sharedCookiesEnabled
      onNavigationStateChange={async () => {
        const cookies = await CookieManager.get('https://www.minds.com');
        const token = cookies?.['XSRF-TOKEN'];
        console.log('cookieString', token);
        onSetCookie?.(token.value);
      }}
      style={{ height: 0, width: 0 }}
    />
  );
};

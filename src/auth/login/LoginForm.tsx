import React from 'react';

import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer, useLocalStore } from 'mobx-react';
import ResetPasswordModal, {
  ResetPasswordModalHandles,
} from '../reset-password/ResetPasswordModal';
import Icon from 'react-native-vector-icons/Ionicons';
import createLoginStore from './createLoginStore';
import FastImage from 'react-native-fast-image';
import UserModel from '../../channel/UserModel';
import sessionService from '../../common/services/session.service';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import MText from '../../common/components/MText';
import { IS_IOS } from '../../config/Config';
import { Button, Row, B1 } from '~ui';
import DismissKeyboard from '~/common/components/DismissKeyboard';

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
  const resetRef = React.useRef<ResetPasswordModalHandles>(null);
  const localStore = useLocalStore(createLoginStore, { props, resetRef });

  const theme = ThemedStyles.style;

  const user = React.useMemo(() => {
    const u =
      props.sessionIndex !== undefined
        ? UserModel.checkOrCreate(
            sessionService.tokensData[props.sessionIndex].user,
          )
        : sessionService.getUser();

    if (props.sessionIndex !== undefined) {
      localStore.username = u.username;
    }
    return u;
  }, [props.sessionIndex, localStore]);

  const usernameInput = props.relogin ? (
    <View style={styles.container}>
      <FastImage
        source={user.getAvatarSource('medium')}
        style={styles.avatar}
      />
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
      autoComplete="username"
      textContentType="username"
      value={localStore.username}
      testID="usernameInput"
      autoCorrect={false}
      noBottomBorder
      keyboardType="name-phone-pad"
      error={
        localStore.showErrors &&
        !localStore.username &&
        i18n.t('auth.fieldRequired')
      }
      autoFocus={true}
    />
  );

  return (
    <View style={theme.flexContainer}>
      <DismissKeyboard>
        {usernameInput}
        <View style={theme.marginBottom4x}>
          <InputContainer
            placeholder={i18n.t('auth.password')}
            secureTextEntry={localStore.hidePassword}
            autoComplete="password"
            textContentType="password"
            onChangeText={localStore.setPassword}
            value={localStore.password}
            testID="userPasswordInput"
            autoFocus={props.relogin}
            error={
              localStore.showErrors &&
              !localStore.password &&
              i18n.t('auth.fieldRequired')
            }
          />
          <Icon
            name={localStore.hidePassword ? 'md-eye' : 'md-eye-off'}
            size={25}
            onPress={localStore.toggleHidePassword}
            style={styles.icon}
          />
        </View>
        <Button
          mode="outline"
          type="action"
          testID="loginButton"
          spinner
          horizontal="XL"
          top="XXL"
          onPress={localStore.onLoginPress}>
          {i18n.t('auth.login')}
        </Button>
        <Row top="L2" align="centerBoth">
          <B1 onPress={localStore.onForgotPress}>{i18n.t('auth.forgot')}</B1>
        </Row>
        <ResetPasswordModal ref={resetRef} />
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
});

import React from 'react';
import { View, Platform } from 'react-native';
import BoxShadow from '../../common/components/BoxShadow';
import InputContainer from '../../common/components/InputContainer';
import i18n from '../../common/services/i18n.service';
import { LoginStore } from './createLoginStore';
import { styles, shadowOpt, icon } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../styles/ThemedStyles';
import { observer } from 'mobx-react-lite';
import sessionService from '../../common/services/session.service';
import FastImage from 'react-native-fast-image';
import UserModel from '../../channel/UserModel';
import MText from '../../common/components/MText';

type PropsType = {
  localStore: LoginStore;
  multiUser?: boolean;
  relogin?: boolean;
  sessionIndex?: number;
};

const LoginInputs = observer(
  ({ localStore, multiUser, relogin, sessionIndex }: PropsType) => {
    const theme = ThemedStyles.style;
    const user =
      sessionIndex !== undefined
        ? UserModel.checkOrCreate(sessionService.tokensData[sessionIndex].user)
        : sessionService.getUser();
    const altStyles = !!(relogin || multiUser);

    const inputContainer = altStyles
      ? styles.inputBackground
      : theme.bgPrimaryBackground;

    if (relogin) {
      localStore.setUsername(user.username);
    }

    const inputText = altStyles ? theme.colorWhite : theme.colorPrimaryText;

    const usernameInput = relogin ? (
      <View style={stylesLocal.container}>
        <FastImage
          source={user.getAvatarSource('medium')}
          style={stylesLocal.avatar}
        />
        <View style={stylesLocal.nameContainer}>
          <MText style={stylesLocal.name}>{user.name}</MText>
          <MText
            style={stylesLocal.username}
            testID={`username${user.username}`}>
            @{user.username}
          </MText>
        </View>
      </View>
    ) : (
      <InputContainer
        containerStyle={inputContainer}
        labelStyle={inputText}
        style={inputText}
        placeholder={i18n.t('auth.username')}
        onChangeText={localStore.setUsername}
        autoCompleteType="username"
        textContentType="username"
        value={localStore.username}
        testID="usernameInput"
        noBottomBorder
        autoFocus={multiUser}
      />
    );

    const Inputs = (
      <View style={altStyles ? {} : styles.shadow}>
        <View>
          {usernameInput}
          <View>
            <InputContainer
              containerStyle={inputContainer}
              labelStyle={inputText}
              style={inputText}
              placeholder={i18n.t('auth.password')}
              secureTextEntry={localStore.hidePassword}
              autoCompleteType="password"
              textContentType="password"
              onChangeText={localStore.setPassword}
              value={localStore.password}
              testID="userPasswordInput"
              autoFocus={relogin}
            />
            <Icon
              name={localStore.hidePassword ? 'md-eye' : 'md-eye-off'}
              size={25}
              onPress={localStore.toggleHidePassword}
              style={[theme.inputIcon, icon]}
            />
          </View>
        </View>
      </View>
    );

    const InputsWithShadow = Platform.select({
      ios: Inputs,
      android: <BoxShadow setting={shadowOpt}>{Inputs}</BoxShadow>, // Android fallback for shadows
    });

    return InputsWithShadow!; // the ! is because of the possible undefined value that in our case never ocurr
  },
);
const stylesLocal = ThemedStyles.create({
  name: ['bold', 'fontXL'],
  username: ['fontMedium', 'fontM'],
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
});

export default LoginInputs;

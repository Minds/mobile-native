import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/core';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import IonIcon from '@expo/vector-icons/Ionicons';
import InputContainer from '../common/components/InputContainer';
import { icon } from './styles';
import authService from './AuthService';
import NavigationService from '../navigation/NavigationService';
import MText from '../common/components/MText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

type PasswordConfirmation = RouteProp<
  RootStackParamList,
  'PasswordConfirmation'
>;

type PropsType = {
  route?: PasswordConfirmation;
  navigation?: any;
  onConfirm?: (password: string) => void;
  title?: string;
  onGoBackPress?: Function;
};

const PasswordConfirmScreen = withErrorBoundaryScreen(
  observer((props: PropsType) => {
    const theme = ThemedStyles.style;
    const onConfirm = props.route?.params?.onConfirm || props.onConfirm;
    const title = props.route?.params?.title || props.title;
    const onGoBackPress = React.useCallback(() => {
      if (props.route?.params?.onConfirm !== undefined) {
        NavigationService.goBack();
      } else {
        props.onGoBackPress && props.onGoBackPress();
      }
    }, [props]);
    const localStore = useLocalStore(() => ({
      password: '',
      error: false,
      hidePassword: true,
      setPassword(password: string) {
        this.password = password;
      },
      setError(error: boolean) {
        this.error = error;
      },
      toggleHidePassword() {
        this.hidePassword = !this.hidePassword;
      },
      async submit() {
        this.error = false;
        try {
          await authService.validatePassword(this.password);
          if (onConfirm) {
            NavigationService.goBack();
            onConfirm(this.password);
          }
          this.password = '';
        } catch (err) {
          this.error = true;
        }
      },
    }));
    const msg = localStore.error ? (
      <MText style={styles.error}>{i18n.t('auth.invalidPassword')}</MText>
    ) : null;
    const iconStyle = { flex: 2 };
    const touchStyle = { flex: 3, alignItems: 'flex-end' };

    return (
      <SafeAreaView style={[theme.flexContainer, theme.bgPrimaryBackground]}>
        <KeyboardAwareScrollView style={theme.flexContainer}>
          <View style={styles.container}>
            <Icon
              name="chevron-left"
              size={32}
              color={ThemedStyles.getColor('SecondaryText')}
              style={iconStyle}
              onPress={onGoBackPress}
            />
            <MText style={styles.titleText}>
              {title || i18n.t('auth.confirmpassword')}
            </MText>
            <TouchableOpacity
              onPress={localStore.submit}
              //@ts-ignore
              style={touchStyle}>
              <MText
                style={[
                  theme.fontL,
                  theme.fontMedium,
                  theme.colorLink,
                  theme.paddingTop,
                ]}>
                {i18n.t('continue')}
              </MText>
            </TouchableOpacity>
          </View>
          {msg}
          <MText
            style={[
              theme.colorSecondaryText,
              theme.marginBottom6x,
              theme.paddingLeft4x,
            ]}>
            {i18n.t('auth.confirmPasswordModal')}
          </MText>
          <View style={theme.fullWidth}>
            <InputContainer
              labelStyle={theme.colorPrimaryText}
              style={theme.colorPrimaryText}
              multiline={false}
              placeholder={i18n.t('auth.password')}
              secureTextEntry={localStore.hidePassword}
              autoComplete="password"
              textContentType="password"
              onChangeText={localStore.setPassword}
              value={localStore.password}
              autoFocus
            />
            <IonIcon
              name={localStore.hidePassword ? 'eye-off' : 'eye'}
              size={25}
              onPress={localStore.toggleHidePassword}
              style={[theme.inputIcon, icon, theme.paddingRight]}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }),
  'PasswordConfirmScreen',
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 25,
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 20,
    marginBottom: 25,
  },
  error: {
    marginTop: 8,
    marginBottom: 8,
    color: '#c00',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    flex: 7,
    textAlign: 'center',
    paddingLeft: 10,
  },
});

export default PasswordConfirmScreen;

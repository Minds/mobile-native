import React, { useEffect, useReducer } from 'react';

import { Alert } from 'react-native';

import settingsService from '../SettingsService';
import i18n from '../../common/services/i18n.service';
import validator from '../../common/services/validator.service';
import CenteredLoading from '../../common/components/CenteredLoading';
import { inject, observer } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';
import { Button, Screen } from '~ui';
import InputContainer from '~/common/components/InputContainer';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import { useNavigation } from '@react-navigation/native';

const EmailScreenS = inject('user')(
  observer(({ user }) => {
    const navigation = useNavigation();
    const [{ email, saving, loaded, inProgress, showConfirmNote }, setState] =
      useReducer<EmailStateFn>(
        (prevState, nextState) => ({ ...prevState, ...nextState }),
        {
          email: '',
          saving: false,
          loaded: false,
          inProgress: false,
          showConfirmNote: false,
        },
      );

    const save = async () => {
      if (!validator.email(email)) {
        return;
      }
      setState({ saving: true });
      settingsService
        .submitSettings({
          email: email,
        })
        .catch(() => {
          Alert.alert(i18n.t('error'), i18n.t('settings.errorSaving'));
        })
        .finally(() => {
          setState({ saving: false });
          user.me.setEmailConfirmed(false);
        });
    };

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <Button
            type="action"
            mode="flat"
            size="small"
            onPress={() =>
              navigation.navigate('PasswordConfirmation', {
                title: i18n.t('auth.confirmpassword'),
                onConfirm: save,
              })
            }>
            {i18n.t('save')}
          </Button>
        ),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [save]);

    useEffect(() => {
      settingsService.getSettings().then(({ channel }) => {
        setState({ email: channel.email, loaded: true });
      });
    }, []);

    const theme = ThemedStyles.style;

    const setEmail = (value: string) =>
      setState({ email: value, showConfirmNote: true });

    const valid = validator.email(email);

    if (saving || !loaded) {
      return <CenteredLoading />;
    }

    return (
      <Screen>
        <DismissKeyboard
          style={[
            theme.flexContainer,
            theme.paddingTop3x,
            theme.bgPrimaryBackground,
          ]}>
          <InputContainer
            placeholder={i18n.t('settings.currentEmail')}
            onChangeText={setEmail}
            value={email}
            editable={!inProgress}
            testID="emailScreenInput"
            error={valid ? undefined : i18n.t('validation.email')}
            selectTextOnFocus={true}
          />
          {showConfirmNote ? (
            <MText
              style={[
                theme.colorSecondaryText,
                theme.fontM,
                theme.paddingHorizontal2x,
                theme.centered,
                theme.marginTop3x,
              ]}>
              {i18n.t('emailConfirm.confirmNote')}
            </MText>
          ) : null}
        </DismissKeyboard>
      </Screen>
    );
  }),
);

type EmailState = {
  email?: string;
  saving?: boolean;
  loaded?: boolean;
  inProgress?: boolean;
  showConfirmNote?: boolean;
};
type EmailStateFn = (prev: EmailState, next: EmailState) => EmailState;

export default EmailScreenS;

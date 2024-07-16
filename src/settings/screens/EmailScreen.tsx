import React, { useEffect, useReducer } from 'react';

import { Alert } from 'react-native';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native';

import validator from '~/common/services/validator.service';
import CenteredLoading from '~/common/components/CenteredLoading';

import MText from '~/common/components/MText';
import { Button, Screen } from '~ui';
import InputContainer from '~/common/components/InputContainer';
import DismissKeyboard from '~/common/components/DismissKeyboard';
import sp from '~/services/serviceProvider';

const EmailScreenS = inject('user')(
  observer(({ user }) => {
    const navigation = useNavigation();
    const i18n = sp.i18n;
    const [
      { email, saving, loaded, inProgress, showConfirmNote, disabled },
      setState,
    ] = useReducer<EmailStateFn>(
      (prevState, nextState) => ({ ...prevState, ...nextState }),
      {
        email: '',
        saving: false,
        loaded: false,
        inProgress: false,
        showConfirmNote: false,
        disabled: true,
      },
    );

    const save = () => {
      if (!validator.email(email)) {
        return;
      }
      setState({ saving: true });
      sp.resolve('settings')
        .submitSettings({ email })
        .then(() => {
          user.me.confirmEmailCode();
        })
        .catch(() => {
          Alert.alert(i18n.t('error'), i18n.t('settings.errorSaving'));
        })
        .finally(() => {
          setState({ saving: false, disabled: true });
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
            disabled={disabled}
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
    }, [save, disabled]);

    useEffect(() => {
      sp.resolve('settings')
        .getSettings()
        .then(({ channel }) => {
          setState({ email: channel.email, loaded: true });
        });
    }, []);

    const theme = sp.styles.style;

    const setEmail = (value: string) => {
      setState({
        email: value,
        showConfirmNote: true,
        disabled: value === email,
      });
    };

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
  disabled?: boolean;
};
type EmailStateFn = (prev: EmailState, next: EmailState) => EmailState;

export default EmailScreenS;

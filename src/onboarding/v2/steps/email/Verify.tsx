import React from 'react';
import { Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';
import sessionService from '../../../../common/services/session.service';
import Resend from './Resend';

type PropsType = {
  params: {
    __e_cnf_token: string;
  };
};

/**
 * Check if the token hasn't expired already and is for the active user
 * @param token string
 * @returns { isValid, isValidDate, isValidUser }
 */
const verifyToken = (token: string) => {
  //@ts-ignore
  const { exp, user_guid } = JSON.parse(atob(token.split('.')[1]));
  const isValidDate =
    exp * 1000 >= Date.now() || i18n.t('onboarding.emailLinkExpired');
  const isValidUser =
    sessionService.getUser().guid === user_guid ||
    i18n.t('onboarding.emailLinkInvalidUser');
  const isValid = isValidDate === true && isValidUser === true;
  return { isValid, isValidDate, isValidUser };
};

/**
 * Request to confirm email
 * @param params contains the token to confirm
 */
const confirmEmail = async params => {
  try {
    await sessionService.getUser().confirmEmail(params);
  } catch (err) {
    console.log(err);
  }
};

const Verify = ({ params }: PropsType) => {
  const { isValid, isValidDate, isValidUser } = verifyToken(
    params.__e_cnf_token,
  );

  React.useEffect(() => {
    isValid && confirmEmail(params);
  });

  const message = isValid
    ? i18n.t('emailConfirm.confirmed')
    : isValidUser !== true
    ? isValidUser
    : isValidDate;

  return (
    <>
      <Text style={[ThemedStyles.style.fontL, ThemedStyles.style.textCenter]}>
        {message + '\n'}
      </Text>
      {isValidDate !== true && <Resend buttonOnly />}
    </>
  );
};

export default Verify;

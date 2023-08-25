import React from 'react';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import { Session } from '../../../common/services/storage/session.storage.service';
import AuthService from '../../AuthService';
import ChannelListItem from '../../../common/components/ChannelListItem';
import ThemedStyles from '../../../styles/ThemedStyles';
import LoggedUserDetails from './LoggedUserDetails';
import NavigationService from '../../../navigation/NavigationService';

type PropsType = {
  tokenData: Session;
  index: number;
};

const doLogin = async (index: number) => {
  if (index === sessionService.activeIndex) {
    return;
  }
  if (sessionService.getSessionForIndex(index).sessionExpired) {
    NavigationService.navigate('RelogScreen', {
      sessionIndex: index,
      onLogin: () => AuthService.loginWithIndex(index),
    });
  } else {
    AuthService.loginWithIndex(index);
  }
};

const LoggedUserItem = ({ tokenData, index }: PropsType) => {
  const user = UserModel.checkOrCreate(tokenData.user);
  const login = React.useCallback(() => {
    doLogin(index);
  }, [index]);
  const renderRight = React.useMemo(
    () => () =>
      (
        <LoggedUserDetails
          index={index}
          isActive={index === sessionService.activeIndex}
          username={user.username}
          onSwitchPress={login}
        />
      ),
    [index, login, user.username],
  );
  return (
    <ChannelListItem
      channel={user}
      onUserTap={login}
      containerStyles={styles.container}
      renderRight={renderRight}
      nameStyles={styles.name}
      usernameStyles={styles.username}
    />
  );
};

const styles = ThemedStyles.create({
  container: ['bgPrimaryBackgroundHighlight', 'paddingLeft3x'],
  name: ['bold', 'fontXL'],
  username: ['fontMedium', 'fontM'],
});

export default LoggedUserItem;

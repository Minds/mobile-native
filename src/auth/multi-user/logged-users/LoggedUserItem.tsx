import React from 'react';
import UserModel from '~/channel/UserModel';
import { Session } from '~/common/services/storage/session.storage.service';
import ChannelListItem from '~/common/components/ChannelListItem';
import LoggedUserDetails from './LoggedUserDetails';
import sp from '~/services/serviceProvider';

type PropsType = {
  tokenData: Session;
  index: number;
};

const doLogin = async (index: number) => {
  if (index === sp.session.activeIndex) {
    return;
  }
  if (sp.session.getSessionForIndex(index).sessionExpired) {
    sp.navigation.navigate('RelogScreen', {
      sessionIndex: index,
      onLogin: () => sp.resolve('auth').loginWithIndex(index),
    });
  } else {
    sp.resolve('auth').loginWithIndex(index);
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
          isActive={index === sp.session.activeIndex}
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

const styles = sp.styles.create({
  container: ['bgPrimaryBackgroundHighlight', 'paddingLeft3x'],
  name: ['bold', 'fontXL'],
  username: ['fontMedium', 'fontM'],
});

export default LoggedUserItem;

import React from 'react';
import UserModel from '../../../channel/UserModel';
import sessionService from '../../../common/services/session.service';
import { TokensData } from '../../../common/services/storage/session.storage.service';
import AuthService from '../../AuthService';
import RNBootSplash from 'react-native-bootsplash';
import ChannelListItem from '../../../common/components/ChannelListItem';
import ThemedStyles from '../../../styles/ThemedStyles';
import LoggedUserDetails from './LoggedUserDetails';

type PropsType = {
  tokenData: TokensData;
  index: number;
};

const switchToUser = async (index: number) => {
  RNBootSplash.show({ duration: 150 });
  await AuthService.sessionLogout();
  await AuthService.login('', '', {}, index);
  setTimeout(() => {
    RNBootSplash.hide({ duration: 150 });
  }, 500);
};

const LoggedUserItem = ({ tokenData, index }: PropsType) => {
  const user = UserModel.checkOrCreate(tokenData.user);
  const login = React.useCallback(() => {
    if (index === sessionService.activeIndex) {
      return;
    }
    switchToUser(index);
  }, [index]);
  const renderRight = () => (
    <LoggedUserDetails
      index={index}
      isActive={index === sessionService.activeIndex}
      username={user.username}
      onSwitchPress={login}
    />
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

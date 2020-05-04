import React from 'react';
import { useLocalStore } from 'mobx-react';
import GoogleSignInComponent from '../../common/components/GoogleSignInComponent';
import { View } from 'react-native';
import type { User } from '@react-native-community/google-signin';

const createYoutubeImporterStore = () => {
  const store = {
    loading: true,
    userInfo: {} as User,
    setUserInfo(userInfo: User) {
      this.userInfo = userInfo;
    },
  };
  return store;
};

const YoutubeImporter = () => {
  const store = useLocalStore(createYoutubeImporterStore);

  return (
    <View>
      <GoogleSignInComponent onUserInfoGet={store.setUserInfo} />
    </View>
  );
};

export default YoutubeImporter;

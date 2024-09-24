import React, { FunctionComponent, ReactNode } from 'react';
import { ImageBackground, View, StyleSheet, Dimensions } from 'react-native';

import { observer } from 'mobx-react';
import { ChannelStoreType } from '../../channel/v2/createChannelStore';
import UserStore from '../../auth/UserStore';
import type UserModel from '../../channel/UserModel';
import TurboImage from 'react-native-turbo-image';

import sp from '~/services/serviceProvider';

const bannerAspectRatio = 3.2;
const { width } = Dimensions.get('window');
const bannerHeight = width / bannerAspectRatio;
const avatarSize = Math.round(0.7 * bannerHeight);

type propsType = {
  store?: ChannelStoreType | UserStore;
  user?: UserModel;
  children?: ReactNode;
};

const HeaderComponent: FunctionComponent<propsType> = observer(
  ({ user, store, children }: propsType) => {
    const theme = sp.styles.style;

    const channel: UserModel | null | undefined =
      user || (store instanceof UserStore ? store.me : store?.channel);

    if (!channel) {
      return null;
    }

    return (
      <ImageBackground
        style={styles.banner}
        source={channel.getBannerSource()}
        resizeMode="cover">
        <View style={[styles.avatarContainer, theme.bcolorPrimaryBackground]}>
          <TurboImage
            style={[styles.avatar, theme.bcolorPrimaryBorder]}
            source={channel.getAvatarSource()}
            resizeMode="cover"
          />
        </View>
        {children}
      </ImageBackground>
    );
  },
);

const styles = StyleSheet.create({
  banner: {
    aspectRatio: bannerAspectRatio,
    width: '100%',
  },
  avatarContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: -avatarSize / 4,
    alignSelf: 'center',
    borderWidth: 3,
    elevation: 20,
    width: avatarSize + 6,
    height: avatarSize + 6,
    borderRadius: 53,
    zIndex: 10000,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#000',
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: 50,
  },
});

export default HeaderComponent;

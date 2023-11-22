import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../styles/ThemedStyles';
import { ChannelStoreType } from '../../channel/v2/createChannelStore';
import ChannelBadges from '../../channel/badges/ChannelBadges';
import UserStore from '../../auth/UserStore';
import type UserModel from '../../channel/UserModel';
import MText from './MText';

type propsType = {
  store?: ChannelStoreType | UserStore;
  user?: UserModel;
  pay?: boolean;
};

const UserNamesComponent: FunctionComponent<propsType> = observer(
  ({ user, store, pay }) => {
    const theme = ThemedStyles.style;

    const channel: UserModel | null | undefined =
      user || (store instanceof UserStore ? store.me : store?.channel);

    if (!channel) {
      return null;
    }

    return (
      <View>
        <View style={styles.container}>
          {pay && (
            <View style={styles.payContainer}>
              <MText style={[theme.bold, theme.fontXL]}>Tip</MText>
              <MIcon size={30} name="menu-right" color="#95C064" />
            </View>
          )}
          <MText style={styles.name} numberOfLines={1}>
            {channel.name}
          </MText>
          <ChannelBadges channel={channel} />
        </View>
        <MText style={styles.username} numberOfLines={1}>
          @{channel.username}
        </MText>
      </View>
    );
  },
);

const styles = ThemedStyles.create({
  container: ['rowJustifyCenter', 'alignCenter', 'paddingTop8x', 'flexWrap'],
  payContainer: ['rowStretch', 'centered'],
  username: [
    'colorSecondaryText',
    'paddingTop2x',
    'paddingBottom3x',
    'fontL',
    'fullWidth',
    'textCenter',
  ],
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UserNamesComponent;

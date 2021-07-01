import React, { FunctionComponent } from 'react';

import ThemedStyles from '../../styles/ThemedStyles';
import { ChannelStoreType } from '../../channel/v2/createChannelStore';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import ChannelBadges from '../../channel/badges/ChannelBadges';
import UserStore from '../../auth/UserStore';
import type UserModel from '../../channel/UserModel';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
              <Text style={[theme.bold, theme.fontXL]}>Tip</Text>
              <MIcon size={30} name="menu-right" color="#95C064" />
            </View>
          )}
          <Text style={styles.name} numberOfLines={1}>
            {channel.name}
          </Text>
          <ChannelBadges
            channel={channel}
            size={22}
            iconStyle={theme.colorLink}
          />
        </View>
        <Text style={styles.username} numberOfLines={1}>
          @{channel.username}
        </Text>
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
  name: [
    {
      fontSize: 22,
      fontWeight: '600',
      textAlign: 'center',
    },
  ],
});

export default UserNamesComponent;

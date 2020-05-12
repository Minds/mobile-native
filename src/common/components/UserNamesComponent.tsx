import React, { FunctionComponent } from 'react';

import ThemedStyles from '../../styles/ThemedStyles';
import { ChannelStoreType } from '../../channel/v2/createChannelStore';
import { observer } from 'mobx-react';
import { View, Text, StyleSheet } from 'react-native';
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
        <View
          style={[
            theme.rowJustifyCenter,
            theme.alignCenter,
            theme.paddingTop8x,
          ]}>
          {pay && (
            <View style={[theme.rowStretch, theme.centered]}>
              <Text style={[theme.bold, theme.fontXL]}>Pay</Text>
              <MIcon size={30} name="menu-right" color="#95C064" />
            </View>
          )}
          <Text style={styles.name} numberOfLines={1}>
            {channel.name}
          </Text>
          <ChannelBadges
            channel={channel}
            size={22}
            iconStyle={theme.colorGreen}
          />
        </View>
        <Text
          style={[
            styles.username,
            theme.colorSecondaryText,
            theme.paddingTop2x,
            theme.paddingBottom3x,
          ]}
          numberOfLines={1}>
          @{channel.username}
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  username: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UserNamesComponent;

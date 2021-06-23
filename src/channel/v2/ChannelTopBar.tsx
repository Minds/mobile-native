import React from 'react';
import { TextInput, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ChannelStoreType } from './createChannelStore';
import ChannelButtons from './ChannelButtons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';

import { styles as headerStyles } from '../../topbar/Topbar';

type PropsType = {
  navigation: any;
  store?: ChannelStoreType;
  hideButtons?: boolean;
  hideInput?: boolean;
};

const ChannelTopBar = observer(
  ({ navigation, store, hideButtons, hideInput }: PropsType) => {
    const theme = ThemedStyles.style;

    const insets = useSafeAreaInsets();
    const cleanTop = insets.top ? { paddingTop: insets.top } : null;

    return (
      <View
        style={[
          headerStyles.container,
          headerStyles.shadow,
          theme.rowJustifyStart,
          theme.alignCenter,
          cleanTop,
          theme.paddingLeft2x,
          theme.paddingBottom,
          theme.bgPrimaryBackground,
        ]}>
        <MIcon
          size={40}
          name="chevron-left"
          style={[theme.colorIcon, theme.centered]}
          onPress={navigation.goBack}
        />
        {store && !hideInput && (
          <TextInput
            placeholder="Search Channel"
            style={[
              theme.fontL,
              theme.flexContainer,
              theme.colorSecondaryText,
              theme.paddingLeft3x,
              theme.paddingVertical2x,
            ]}
            placeholderTextColor={ThemedStyles.getColor('SecondaryText')}
            value={store.channelSearch}
            onChangeText={store.setChannelSearch}
            returnKeyType={'search'}
            onSubmitEditing={store.searchInChannel}
          />
        )}
        {store && store.channelSearch.length > 0 && (
          <MIcon
            size={25}
            name="close-circle-outline"
            style={[theme.colorIcon, theme.centered]}
            onPress={store.clearSearch}
          />
        )}
        {store && !hideButtons && (
          <ChannelButtons
            iconSize={25}
            store={store}
            onEditPress={() =>
              navigation.push('EditChannelScreen', { store: store })
            }
            notShow={['edit', 'join', 'subscribe', 'boost']}
            containerStyle={theme.centered}
            iconsStyle={[theme.paddingLeft4x, theme.colorSecondaryText]}
          />
        )}
      </View>
    );
  },
);

export default ChannelTopBar;

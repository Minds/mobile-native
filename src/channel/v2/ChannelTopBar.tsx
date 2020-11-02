import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { ChannelStoreType } from './createChannelStore';
import ChannelButtons from './ChannelButtons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PropsType = {
  navigation: any;
  store: ChannelStoreType;
  hideButtons?: boolean;
};

const ChannelTopBar = ({ navigation, store, hideButtons }: PropsType) => {
  const theme = ThemedStyles.style;

  const insets = useSafeAreaInsets();
  const cleanTop = insets.top ? { paddingTop: insets.top } : null;

  return (
    <View
      style={[
        theme.rowJustifySpaceBetween,
        cleanTop,
        // theme.paddingTop2x,
        theme.paddingBottom,
        theme.backgroundPrimary,
      ]}>
      <MIcon
        size={36}
        name="chevron-left"
        style={[styles.backIcon, theme.colorIcon]}
        onPress={navigation.goBack}
      />
      {!hideButtons && (
        <ChannelButtons
          store={store}
          onEditPress={() =>
            navigation.push('EditChannelScreen', { store: store })
          }
          notShow={['edit', 'join', 'subscribe']}
          containerStyle={theme.centered}
          iconsStyle={theme.paddingLeft4x}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { height: 3, width: 0 },
    elevation: 4,
  },
});

export default ChannelTopBar;

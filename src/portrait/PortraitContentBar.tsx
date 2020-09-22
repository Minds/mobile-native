import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { PlaceholderMedia, Fade, Placeholder } from 'rn-placeholder';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ThemedStyles from '../styles/ThemedStyles';
import PortraitContentBarItem from './PortraitContentBarItem';
import createPortraitStore, { PortraitBarItem } from './createPortraitStore';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.push('Capture', { portrait: true })}
      style={[styles.add, theme.backgroundTertiary, theme.centered]}>
      <Text style={[theme.fontXXL, theme.colorSecondaryText]}>+</Text>
    </TouchableOpacity>
  );
};

export const portraitBarRef = React.createRef<FlatList<PortraitBarItem>>();
const BarPlaceholder = () => {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('tertiary_background');
  const animation = (props) => (
    <Fade {...props} style={theme.backgroundPrimary} />
  );
  return (
    <Placeholder Animation={animation}>
      <View style={theme.rowJustifyStart}>
        <PlaceholderMedia
          isRound
          color={color}
          style={[theme.margin2x, styles.placeholder]}
        />
        <PlaceholderMedia
          isRound
          color={color}
          style={[theme.margin2x, styles.placeholder]}
        />
        <PlaceholderMedia
          isRound
          color={color}
          style={[theme.margin2x, styles.placeholder]}
        />
      </View>
    </Placeholder>
  );
};

const PortraitContentBar = observer(
  forwardRef((_, ref) => {
    const theme = ThemedStyles.style;
    const store = useLocalStore(createPortraitStore);
    const navigation = useNavigation<any>();

    useEffect(() => {
      store.load();
    }, [store]);

    useImperativeHandle(ref, () => ({
      load: () => {
        store.load();
      },
    }));

    const Empty = useCallback(() => {
      if (store.loading) {
        return <BarPlaceholder />;
      }
      return null;
    }, [store]);

    const renderItem = useCallback(
      (row: { item: PortraitBarItem; index: number }) => (
        <PortraitContentBarItem
          item={row.item}
          onPress={() =>
            navigation.push('ActivityFullScreenNav', {
              screen: 'PortraitViewerScreen',
              params: {
                items: store.items,
                index: row.index,
              },
            })
          }
        />
      ),
      [navigation, store],
    );

    return (
      <View
        style={[
          theme.borderBottom8x,
          theme.borderBackgroundPrimary,
          theme.fullWidth,
        ]}>
        <FlatList
          contentContainerStyle={[
            theme.rowJustifyStart,
            theme.backgroundSecondary,
            theme.fullWidth,
          ]}
          style={styles.bar}
          horizontal={true}
          ListHeaderComponent={Header}
          ListEmptyComponent={Empty}
          renderItem={renderItem}
          data={store.items.slice()}
        />
      </View>
    );
  }),
);

const styles = StyleSheet.create({
  bar: {
    minHeight: 90,
  },
  loading: {
    height: 80,
    alignSelf: 'center',
  },
  add: {
    margin: 10,
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
  placeholder: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
});

export default PortraitContentBar;

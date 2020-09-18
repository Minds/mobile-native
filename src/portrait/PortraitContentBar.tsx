import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { observer, useLocalStore } from 'mobx-react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import PortraitContentBarItem from './PortraitContentBarItem';
import createPortraitStore, { PortraitBarItem } from './createPortraitStore';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

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
      <FlatList
        //id="portrait-bar"
        contentContainerStyle={[
          theme.rowJustifyStart,
          theme.backgroundSecondary,
          theme.borderBottom8x,
          theme.borderBackgroundPrimary,
          theme.fullWidth,
        ]}
        style={styles.bar}
        horizontal={true}
        ListHeaderComponent={Header}
        renderItem={renderItem}
        data={store.items.slice()}
      />
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
});

export default PortraitContentBar;

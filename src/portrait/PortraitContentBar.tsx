import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { PlaceholderMedia, Fade, Placeholder } from 'rn-placeholder';
import { observer } from 'mobx-react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ThemedStyles from '../styles/ThemedStyles';
import PortraitContentBarItem from './PortraitContentBarItem';
import { PortraitBarItem } from './createPortraitStore';
import { useNavigation } from '@react-navigation/native';
import { useStores } from '../common/hooks/use-stores';
import MText from '../common/components/MText';

/**
 * Header component
 */
const Header = () => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation<any>();
  const nav = useCallback(
    () => navigation.push('Capture', { portrait: true }),
    [navigation],
  );

  return (
    <TouchableOpacity
      onPress={nav}
      style={[styles.add, theme.bgTertiaryBackground, theme.centered]}
    >
      <MText style={[theme.fontXXL, theme.colorSecondaryText]}>+</MText>
    </TouchableOpacity>
  );
};

/**
 * Portrait bar Ref
 */
export const portraitBarRef = React.createRef<FlatList<PortraitBarItem>>();

const BarPlaceholder = () => {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('TertiaryBackground');
  const animation = props => (
    <Fade {...props} style={theme.bgPrimaryBackground} />
  );
  return (
    <Placeholder Animation={animation}>
      <View style={theme.rowJustifyStart}>
        <PlaceholderMedia isRound color={color} style={styles.placeholder} />
        <PlaceholderMedia isRound color={color} style={styles.placeholder} />
        <PlaceholderMedia isRound color={color} style={styles.placeholder} />
      </View>
    </Placeholder>
  );
};

const renderItem = (row: { item: PortraitBarItem; index: number }) => {
  return <PortraitContentBarItem item={row.item} index={row.index} />;
};

/**
 * Portrait content bar
 */
const PortraitContentBar = observer(
  forwardRef((_, ref) => {
    const store = useStores().portrait;

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

    return (
      <View style={containerStyle}>
        <FlatList
          // @ts-ignore
          ref={portraitBarRef}
          contentContainerStyle={listContainerStyle}
          style={styles.bar}
          horizontal={true}
          ListHeaderComponent={Header}
          ListEmptyComponent={Empty}
          renderItem={renderItem}
          data={store.items.slice()}
          keyExtractor={keyExtractor}
        />
      </View>
    );
  }),
);

const keyExtractor = (item, _) => item.user.guid;

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
    ...ThemedStyles.style.margin2x,
  },
});

const listContainerStyle = ThemedStyles.combine(
  'paddingLeft',
  'rowJustifyStart',
  'bgPrimaryBackground',
);
const containerStyle = ThemedStyles.combine(
  'borderBottom8x',
  'bcolorTertiaryBackground',
  'fullWidth',
);

export default PortraitContentBar;

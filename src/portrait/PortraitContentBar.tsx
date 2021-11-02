import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { PlaceholderMedia, Fade, Placeholder } from 'rn-placeholder';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import { Icon, B3, Column } from '~ui';
import { AVATAR_SIZE } from '~/styles/Tokens';
import PressableScale from '~/common/components/PressableScale';
import ThemedStyles from '../styles/ThemedStyles';
import PortraitContentBarItem from './PortraitContentBarItem';
import { PortraitBarItem } from './createPortraitStore';
import { useNavigation } from '@react-navigation/native';
import { useStores } from '../common/hooks/use-stores';

/**
 * Header component
 */
const Header = () => {
  const navigation = useNavigation<any>();
  const nav = useCallback(
    () => navigation.push('Capture', { portrait: true }),
    [navigation],
  );

  return (
    <Column align="center" flex horizontal="XS">
      <PressableScale onPress={nav}>
        <Column
          horizontal="XXS"
          vertical="XXS"
          containerStyle={styles.addCircle}
          align="center">
          <Icon name="plus" />
        </Column>
      </PressableScale>
      <B3 color="secondary" top="XXS">
        Add
      </B3>
    </Column>
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
      <View style={styles.containerStyle}>
        <FlatList
          // @ts-ignore
          ref={portraitBarRef}
          contentContainerStyle={styles.listContainerStyle}
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

const styles = ThemedStyles.create({
  bar: {
    minHeight: 90,
  },
  loading: {
    height: 80,
    alignSelf: 'center',
  },
  addCircle: [
    {
      height: AVATAR_SIZE.medium,
      width: AVATAR_SIZE.medium,
      borderRadius: AVATAR_SIZE.medium / 2,
    },
    'bgTertiaryBackground',
  ],
  placeholder: [
    {
      height: AVATAR_SIZE.medium,
      width: AVATAR_SIZE.medium,
      borderRadius: AVATAR_SIZE.medium / 2,
    },
    'margin2x',
  ],
  listContainerStyle: [
    'paddingLeft2x',
    'rowJustifyStart',
    'bgPrimaryBackground',
  ],
  containerStyle: ['borderBottom8x', 'bcolorTertiaryBackground', 'fullWidth'],
});

export default PortraitContentBar;

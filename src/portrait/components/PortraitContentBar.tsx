import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View, FlatList } from 'react-native';
import Placeholder from '~/common/components/Placeholder';
import PressableScale from '~/common/components/PressableScale';
import { useStores } from '~/common/hooks/use-stores';
import { B3, Icon, Row } from '~/common/ui';

import { AVATAR_SIZE } from '~/styles/Tokens';

import { PortraitBarBoostItem } from '../models/PortraitBarBoostItem';
import PortraitBarItem from '../models/PortraitBarItem';
import PortraitContentBarItem from './PortraitContentBarItem';
import sp from '~/services/serviceProvider';

/**
 * Header component
 */
const Header = () => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.addContainer}>
      <PressableScale
        onPress={() => navigation.push('Capture', { portrait: true })}>
        <View style={styles.addCircle}>
          <Icon size={'huge'} name="plus" color="PrimaryText" />
        </View>
      </PressableScale>
      <B3 top="XS">{sp.i18n.t('newMoment')}</B3>
    </View>
  );
};

/**
 * Portrait bar Ref
 */
export const portraitBarRef = React.createRef<FlatList<PortraitBarItem>>();

const BarPlaceholder = () => {
  return (
    <Row space="M">
      <Placeholder
        horizontal="XS"
        radius="round"
        width={AVATAR_SIZE.medium}
        height={AVATAR_SIZE.medium}
      />
      <Placeholder
        horizontal="XS"
        radius="round"
        width={AVATAR_SIZE.medium}
        height={AVATAR_SIZE.medium}
      />
      <Placeholder
        horizontal="XS"
        radius="round"
        width={AVATAR_SIZE.medium}
        height={AVATAR_SIZE.medium}
      />
    </Row>
  );
};

const renderItem = ({ item }: { item: PortraitBarItem }) => {
  return (
    <PortraitContentBarItem
      avatarUrl={item.user.getAvatarSource()}
      title={item.user.username}
      unseen={item.unseen}
      guid={item.user.guid}
    />
  );
};

/**
 * Portrait content bar
 */
const PortraitContentBar = observer(() => {
  const store = useStores().portrait;

  const Empty = useCallback(() => {
    if (store.loading) {
      return <BarPlaceholder />;
    }
    return null;
  }, [store]);

  return (
    <View style={styles.containerStyle}>
      <FlatList
        ref={portraitBarRef}
        contentContainerStyle={styles.listContainerStyle}
        style={styles.bar}
        horizontal={true}
        ListHeaderComponent={Header}
        ListEmptyComponent={Empty}
        renderItem={renderItem}
        data={store.items
          // do not show boosts in the portrait bar
          .filter(item => !(item instanceof PortraitBarBoostItem))
          .slice()}
        keyExtractor={keyExtractor}
      />
    </View>
  );
});

const keyExtractor = (item, _) => item.user.guid;

const styles = sp.styles.create({
  bar: {
    minHeight: 90,
  },
  loading: {
    height: 80,
    alignSelf: 'center',
  },
  addContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addCircle: [
    {
      marginHorizontal: 12,
      marginBottom: 2,
      height: AVATAR_SIZE.medium,
      width: AVATAR_SIZE.medium,
      borderRadius: AVATAR_SIZE.medium / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    'bgBaseBackground',
  ],
  listContainerStyle: [
    'paddingLeft2x',
    'rowJustifyStart',
    'bgPrimaryBackground',
  ],
  containerStyle: [
    'borderBottom1x',
    'bcolorBaseBackground',
    'fullWidth',
    'rowStretch',
  ],
});

export default PortraitContentBar;

import React from 'react';
import { View, FlatList } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import ThemedStyles from '../../styles/ThemedStyles';

const keyExtractor = (_, index) => `_${index}`;

const renderItem = item => (
  <MenuItem noBorderTop={item.index > 0} {...item.item} />
);

export default function ({ navigation, route }) {
  const { options } = route.params ?? {};
  return options ? (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <FlatList
          data={options(navigation, route).filter(Boolean)}
          renderItem={renderItem}
          style={styles.list}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  ) : null;
}

const styles = ThemedStyles.create({
  container: [
    'flexContainer',
    'bgPrimaryBackground',
    'alignSelfCenterMaxWidth',
  ],
  innerWrapper: ['borderBottomHair', 'bcolorPrimaryBorder'],
  list: ['bgPrimaryBackground', 'paddingTop4x'],
});

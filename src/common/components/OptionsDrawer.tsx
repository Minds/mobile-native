import React from 'react';
import { View, FlatList } from 'react-native';
import MenuItem from '../../common/components/menus/MenuItem';
import ThemedStyles from '../../styles/ThemedStyles';

const keyExtractor = (item, index) => index.toString();

const renderItem = item => (
  <MenuItem
    item={item.item}
    containerItemStyle={
      item.index > 0 ? ThemedStyles.style.borderTop0x : undefined
    }
  />
);

export default function ({ navigation, route }) {
  if (!route.params.options) {
    return null;
  }

  const list = route.params.options(navigation, route).filter(r => r);

  return (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <FlatList
          data={list}
          renderItem={renderItem}
          style={styles.list}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
}

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  innerWrapper: ['borderBottomHair', 'bcolorPrimaryBorder'],
  list: ['bgPrimaryBackground', 'paddingTop4x'],
});

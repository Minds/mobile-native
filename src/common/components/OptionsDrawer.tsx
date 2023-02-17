import React from 'react';
import { View, FlatList } from 'react-native';
import { PerformanceListWrapper } from 'services/performance';
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
        <PerformanceListWrapper name="OptionsDrawer">
          <FlatList
            data={options(navigation, route).filter(Boolean)}
            renderItem={renderItem}
            style={styles.list}
            keyExtractor={keyExtractor}
          />
        </PerformanceListWrapper>
      </View>
    </View>
  ) : null;
}

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
  innerWrapper: ['borderBottomHair', 'bcolorPrimaryBorder'],
  list: ['bgPrimaryBackground', 'paddingTop4x'],
});

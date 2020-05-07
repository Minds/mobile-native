import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';

interface StoreType {
  tab: string;
  setTab: (value: any) => void;
}

type tabType = {
  name: string;
  label: string;
};

type PropsType = {
  store: StoreType;
  tabList: Array<tabType>;
};

const HeaderTabsComponent = observer(({ store, tabList }: PropsType) => {
  const theme = ThemedStyles.style;
  const tabStyle = [
    theme.paddingVertical,
    theme.paddingHorizontal2x,
    theme.borderBottom3x,
  ];

  const tab = store.tab;

  return (
    <View
      style={[
        theme.paddingHorizontal4x,
        theme.rowJustifyStart,
        theme.borderBottom,
        theme.borderPrimary,
      ]}>
      {tabList.map(({ name, label }: tabType) => {
        return (
          <TouchableOpacity
            onPress={() => store.setTab(name)}
            style={[
              tabStyle,
              tab === name ? theme.borderLink : theme.borderBackgroundSecondary,
            ]}>
            <Text style={theme.fontL}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

export default HeaderTabsComponent;

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';

import MText from './MText';
import sp from '~/services/serviceProvider';

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
  const theme = sp.styles.style;
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
        theme.bcolorPrimaryBorder,
      ]}>
      {tabList.map(({ name, label }: tabType) => {
        return (
          <TouchableOpacity
            key={name}
            onPress={() => store.setTab(name)}
            style={[
              tabStyle,
              tab === name ? theme.bcolorLink : theme.bcolorPrimaryBackground,
            ]}>
            <MText style={theme.fontL}>{label}</MText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

export default HeaderTabsComponent;

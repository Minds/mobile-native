import React, { useEffect, useRef } from 'react';
import {
  WalletScreenNavigationProp,
  WalletScreenRouteProp,
} from '../../v2/WalletScreen';
import { View, Text, StyleSheet } from 'react-native';
import { WalletStoreType } from '../../v2/createWalletStore';
import ThemedStyles from '../../../styles/ThemedStyles';
import { ScrollView } from 'react-native-gesture-handler';
import AccordionSet, {
  AccordionDataType,
  RenderFunction,
} from '../../../common/components/AccordionSet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const HeaderComponent: RenderFunction = (
  content: AccordionDataType,
  index: number,
  isActive: boolean,
) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.rowJustifySpaceBetween}>
      <Text>{content.title}</Text>
      <Text>{content.subtitle}</Text>
      <Icon
        name={`chevron-${isActive ? 'up' : 'down'}`}
        size={14}
        color={ThemedStyles.getColor('secondary_text')}
      />
    </View>
  );
};

const ContentComponent: RenderFunction = (content: AccordionDataType) =>
  content.children;

const UsdEarnings = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;

  const accordionData: Array<AccordionDataType> = [
    {
      title: 'Minds Pro',
      subtitle: '$100',
      children: (
        <View>
          <Text>minds pro</Text>
        </View>
      ),
    },
    {
      title: 'Minds+',
      subtitle: '$0.35',
      children: (
        <View>
          <Text>minds plus</Text>
        </View>
      ),
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[theme.paddingTop4x, theme.paddingHorizontal3x]}>
      <AccordionSet
        data={accordionData}
        headerComponent={HeaderComponent}
        contentComponent={ContentComponent}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({});

export default UsdEarnings;

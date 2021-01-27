import React from 'react';
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
import { observer } from 'mobx-react';
import AccordionHeader from './AccordionHeader';
import AccordionContent from './AccordionContent';

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const renderHeader = (content: AccordionDataType, index, isActive) => (
  <AccordionHeader
    title={content.title}
    subtitle={content.subtitle}
    tooltip={content.tooltip}
    isActive={isActive}
  />
);

const ContentComponent: RenderFunction = (content: AccordionDataType) =>
  content.children;

const UsdEarnings = observer(({ walletStore, navigation }: PropsType) => {
  const theme = ThemedStyles.style;

  const accordionData: Array<AccordionDataType> = [
    {
      title: 'Minds Pro',
      subtitle: '$100',
      children: <AccordionContent />,
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
    },
    {
      title: 'Minds+',
      subtitle: '$0.35',
      children: <AccordionContent />,
    },
  ];

  return (
    <ScrollView contentContainerStyle={theme.paddingTop4x}>
      <AccordionSet
        data={accordionData}
        headerComponent={renderHeader}
        contentComponent={ContentComponent}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({});

export default UsdEarnings;

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

type PropsType = {
  navigation: WalletScreenNavigationProp;
  walletStore: WalletStoreType;
  route: WalletScreenRouteProp;
};

const renderHeader = (content, index, isActive) => (
  <AccordionHeader content={content} isActive={isActive} />
);

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
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
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
        headerComponent={renderHeader}
        contentComponent={ContentComponent}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({});

export default UsdEarnings;

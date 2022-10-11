import { useBottomSheet } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { ReactNode, useCallback } from 'react';
import { View } from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import { BottomSheet, BottomSheetProps } from './';

type BottomSheetScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BottomSheet'
>;

export type BottomSheetScreenParams = {
  component: (ref: BottomSheetMethods) => ReactNode;
} & Omit<BottomSheetProps, 'children'>;

export interface BottomSheetScreenProps {
  navigation: BottomSheetScreenNavigationProp;
  route: {
    params: BottomSheetScreenParams;
  };
}

export default function BottomSheetScreen({
  route,
  navigation,
}: BottomSheetScreenProps) {
  const { component, ...props } = route.params;

  const handleClose = useCallback(() => {
    props?.onClose?.();
    navigation.goBack();
  }, [navigation, props]);

  return (
    <BottomSheet
      index={0}
      enableContentPanningGesture={true}
      {...props}
      onClose={handleClose}>
      <BottomSheetInnerContainer component={component} />
    </BottomSheet>
  );
}

const BottomSheetInnerContainer = ({
  component,
}: Pick<BottomSheetScreenParams, 'component'>) => {
  const bottomSheet = useBottomSheet();

  return <View style={styles.container}>{component(bottomSheet)}</View>;
};

export const pushBottomSheet = (params: BottomSheetScreenParams) =>
  NavigationService.push('BottomSheet', params);

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
});

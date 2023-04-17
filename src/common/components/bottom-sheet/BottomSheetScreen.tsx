import {
  useBottomSheet,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { ReactNode, useCallback } from 'react';
import { Keyboard, View } from 'react-native';
import NavigationService from '../../../navigation/NavigationService';
import { RootStackParamList } from '../../../navigation/NavigationTypes';
import ThemedStyles from '../../../styles/ThemedStyles';
import { BottomSheet, BottomSheetProps } from './';
import { useBackHandler } from '@react-native-community/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

type BottomSheetScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BottomSheet'
>;

export type BottomSheetScreenParams = {
  safe?: boolean;
  component: (
    ref: BottomSheetMethods,
    handleContentLayout: ({
      nativeEvent: {
        layout: { height },
      },
    }: any) => void,
  ) => ReactNode;
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
  const { component, snapPoints, safe, ...props } = route.params;

  const handleClose = useCallback(() => {
    props?.onClose?.();
    navigation.goBack();
  }, [navigation, props]);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(
    (snapPoints as (string | number)[]) ?? ['CONTENT_HEIGHT'],
  );

  const Container = safe
    ? BottomSheetInnerContainerSafe
    : BottomSheetInnerContainer;

  return (
    <BottomSheet
      index={0}
      enableContentPanningGesture={true}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      snapPoints={animatedSnapPoints}
      {...props}
      onClose={handleClose}>
      <Container
        component={component}
        handleContentLayout={handleContentLayout}
      />
    </BottomSheet>
  );
}

const BottomSheetInnerContainer = ({
  component,
  handleContentLayout,
}: Pick<BottomSheetScreenParams, 'component'> | any) => {
  const bottomSheet = useBottomSheet();

  useBackHandler(
    useCallback(() => {
      bottomSheet.close();
      return true;
    }, [bottomSheet]),
  );

  const close = () => {
    bottomSheet.close();
    setTimeout(() => {
      NavigationService.goBack();
    }, 200);
  };

  return (
    <View style={styles.container}>
      {component({ ...bottomSheet, close }, handleContentLayout)}
    </View>
  );
};

const BottomSheetInnerContainerSafe = ({
  component,
  handleContentLayout,
}: Pick<BottomSheetScreenParams, 'component'> | any) => {
  const bottomSheet = useBottomSheet();

  const close = () => {
    bottomSheet.close();
    setTimeout(() => {
      NavigationService.goBack();
    }, 200);
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={styles.container}
      onLayout={handleContentLayout}>
      {component({ ...bottomSheet, close }, handleContentLayout)}
    </SafeAreaView>
  );
};

export const pushBottomSheet = (params: BottomSheetScreenParams) => {
  Keyboard.dismiss();
  NavigationService.push('BottomSheet', params);
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
});

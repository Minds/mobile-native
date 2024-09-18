import React, { ReactNode, useCallback } from 'react';
import { Keyboard, View } from 'react-native';
import {
  useBottomSheet,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useBackHandler } from '@react-native-community/hooks';

import { RootStackParamList } from '~/navigation/NavigationTypes';

import { BottomSheet, BottomSheetProps } from './';
import { SafeAreaView } from 'react-native-safe-area-context';
import Handle from '../bottom-sheet/Handle';
import MText from '../MText';
import delay from '~/common/helpers/delay';
import sp from '~/services/serviceProvider';

type BottomSheetScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BottomSheet'
>;

export type BottomSheetScreenParams = {
  safe?: boolean;
  title?: string;
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

function BottomSheetScreen({ route, navigation }: BottomSheetScreenProps) {
  const { component, snapPoints, title, safe, ...props } = route.params;

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

  const HandleComponent = useCallback(
    () => (
      <Handle>
        <View style={styles.navbarContainer}>
          <MText style={styles.titleStyle}>{title}</MText>
        </View>
      </Handle>
    ),
    [title],
  );

  return (
    <BottomSheet
      index={0}
      enableContentPanningGesture={true}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      // @ts-ignore until we remove the deprecated useBottomSheetDynamicSnapPoints
      snapPoints={animatedSnapPoints}
      handleComponent={title ? HandleComponent : undefined}
      {...props}
      onClose={handleClose}>
      <Container
        component={component}
        handleContentLayout={handleContentLayout}
      />
    </BottomSheet>
  );
}

export default observer(BottomSheetScreen);

const BottomSheetInnerContainer = ({
  component,
  handleContentLayout,
}: Pick<BottomSheetScreenParams, 'component'> | any) => {
  const bottomSheet = useBottomSheet();
  const isFocused = useIsFocused();

  const close = useCallback(() => {
    return new Promise(async resolve => {
      bottomSheet.close();
      await delay(100);
      sp.navigation.goBack();
      await delay(100);
      resolve(true);
    });
  }, [bottomSheet]);

  useBackHandler(
    useCallback(() => {
      if (!isFocused) {
        return false;
      }

      close();
      return true;
    }, [close, isFocused]),
  );

  return (
    <View style={styles.container}>
      {component({ ...bottomSheet, close }, handleContentLayout)}
    </View>
  );
};

const BottomSheetInnerContainerSafe = observer(
  ({
    component,
    handleContentLayout,
  }: Pick<BottomSheetScreenParams, 'component'> | any) => {
    const bottomSheet = useBottomSheet();

    const close = useCallback(() => {
      return new Promise(async resolve => {
        bottomSheet.close();
        await delay(100);
        sp.navigation.goBack();
        await delay(100);
        resolve(true);
      });
    }, [bottomSheet]);

    return (
      <SafeAreaView
        edges={['bottom']}
        style={styles.container}
        onLayout={handleContentLayout}>
        {component({ ...bottomSheet, close }, handleContentLayout)}
      </SafeAreaView>
    );
  },
);

export const pushBottomSheet = (params: BottomSheetScreenParams) => {
  Keyboard.dismiss();
  sp.navigation.push('BottomSheet', params);
};

const styles = sp.styles.create({
  container: ['flexContainer', 'bgPrimaryBackgroundHighlight'],
  navbarContainer: ['padding2x', 'alignCenter', 'bgPrimaryBackgroundHighlight'],
  titleStyle: ['fontXL', 'marginLeft2x', 'marginBottom', 'bold'],
});

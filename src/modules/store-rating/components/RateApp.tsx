import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetButton,
  pushBottomSheet,
} from '../../../common/components/bottom-sheet';
import i18nService from '../../../common/services/i18n.service';
import { Spacer, H2 } from '../../../common/ui';
import ThemedStyles from '../../../styles/ThemedStyles';
import { TENANT } from '~/config/Config';

interface RateAppProps {
  onConfirm: () => void;
  onCancel: () => void;
  onLayout?: ({
    nativeEvent: {
      layout: { height },
    },
  }: any) => void;
}

export default function RateApp({
  onConfirm,
  onCancel,
  onLayout,
}: RateAppProps) {
  return (
    <SafeAreaView
      edges={['bottom']}
      style={ThemedStyles.style.flexContainer}
      onLayout={onLayout}>
      <Spacer horizontal="L" bottom="S">
        <H2 align="center" bottom="L">
          {i18nService.t('storeRating.prompt', { TENANT })}
        </H2>
      </Spacer>
      <BottomSheetButton
        action
        solid
        text={i18nService.t('yes')}
        onPress={onConfirm}
      />
      <BottomSheetButton text={i18nService.t('no')} onPress={onCancel} />
      <Spacer bottom="L" />
    </SafeAreaView>
  );
}

export const rateApp = (
  props?: Omit<RateAppProps, 'onConfirm' | 'onCancel'>,
): Promise<boolean | null> => {
  return new Promise(resolve =>
    pushBottomSheet({
      component: (bottomSheetRef, handleContentLayout) => (
        <RateApp
          {...props}
          onLayout={handleContentLayout}
          onConfirm={() => {
            resolve(true);
            bottomSheetRef.close();
          }}
          onCancel={() => {
            resolve(false);
            bottomSheetRef.close();
          }}
        />
      ),
      onClose: () => resolve(null),
    }),
  );
};

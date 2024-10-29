import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetButton,
  pushBottomSheet,
} from '~/common/components/bottom-sheet';
import { Spacer, H2 } from '~/common/ui';

import { TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

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
  const i18n = sp.i18n;
  return (
    <SafeAreaView
      edges={['bottom']}
      style={sp.styles.style.flexContainer}
      onLayout={onLayout}>
      <Spacer horizontal="L" bottom="S">
        <H2 align="center" bottom="L">
          {i18n.t('storeRating.prompt', { TENANT })}
        </H2>
      </Spacer>
      <BottomSheetButton
        action
        solid
        text={i18n.t('yes')}
        onPress={onConfirm}
      />
      <BottomSheetButton text={i18n.t('no')} onPress={onCancel} />
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

import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { B1, H2, Spacer } from '../ui';
import { BottomSheetButton, pushBottomSheet } from './bottom-sheet';
import sp from '~/services/serviceProvider';

interface ConfirmProps {
  title: string;
  actionText?: string;
  description?: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  onLayout?: ({
    nativeEvent: {
      layout: { height },
    },
  }: any) => void;
}

export default function Confirm({
  title,
  actionText,
  description,
  onConfirm,
  onCancel,
  onLayout,
}: ConfirmProps) {
  const i18n = sp.i18n;
  return (
    <SafeAreaView
      edges={['bottom']}
      style={sp.styles.style.flexContainer}
      onLayout={onLayout}>
      <Spacer horizontal="L" bottom="S">
        <H2 align="center" bottom="L">
          {title}
        </H2>
        {typeof description === 'string' ? <B1>{description}</B1> : description}
      </Spacer>
      <BottomSheetButton
        action
        solid
        text={actionText ?? i18n.t('confirm')}
        onPress={onConfirm}
      />
      <BottomSheetButton text={i18n.t('cancel')} onPress={onCancel} />
      <Spacer bottom="L" />
    </SafeAreaView>
  );
}

export const confirm = (
  props: Omit<ConfirmProps, 'onConfirm' | 'onCancel'>,
): Promise<boolean> => {
  return new Promise(resolve =>
    pushBottomSheet({
      component: (bottomSheetRef, handleContentLayout) => (
        <Confirm
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
      onClose: () => resolve(false),
    }),
  );
};

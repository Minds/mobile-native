import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IS_SHORT_PHONE } from '~/config/Config';
import ThemedStyles from '../../styles/ThemedStyles';
import i18nService from '../services/i18n.service';
import { B1, H2, Spacer } from '../ui';
import { BottomSheetButton, pushBottomSheet } from './bottom-sheet';

interface ConfirmProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Confirm({
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmProps) {
  return (
    <SafeAreaView edges={['bottom']} style={ThemedStyles.style.flexContainer}>
      <Spacer horizontal="L" bottom="S">
        <H2 align="center" bottom="L">
          {title}
        </H2>
        {!!description && <B1>{description}</B1>}
      </Spacer>
      <BottomSheetButton
        action
        solid
        text={i18nService.t('confirm')}
        onPress={onConfirm}
      />
      <BottomSheetButton text={i18nService.t('cancel')} onPress={onCancel} />
      <Spacer bottom="L" />
    </SafeAreaView>
  );
}

export const confirm = (
  props: Omit<ConfirmProps, 'onConfirm' | 'onCancel'>,
): Promise<boolean> => {
  return new Promise(resolve =>
    pushBottomSheet({
      component: bottomSheetRef => (
        <Confirm
          {...props}
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
      snapPoints: [IS_SHORT_PHONE ? '40%' : '35%'],
    }),
  );
};

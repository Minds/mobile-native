import React, { PropsWithChildren, useRef } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  BottomSheetButton,
  BottomSheetMenuItem,
  BottomSheetMenuItemProps,
  BottomSheetModal,
  BottomSheetModalHandle,
} from './';
import sp from '~/services/serviceProvider';

export interface MenuSheetProps {
  items: BottomSheetMenuItemProps[];
}

/**
 * A simple component that shows a bottomSheetModal with a list of MenuItems and a cancel button
 */
export default function MenuSheet({
  items,
  children,
}: PropsWithChildren<MenuSheetProps>) {
  const ref = useRef<BottomSheetModalHandle>(null);

  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);

  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);

  return (
    <>
      <TouchableOpacity onPress={show} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
      <BottomSheetModal ref={ref}>
        {items.map((item, i) => (
          <BottomSheetMenuItem
            {...item}
            onPress={() => {
              item.onPress?.();
              close();
            }}
            key={i}
          />
        ))}
        <BottomSheetButton text={sp.i18n.t('cancel')} onPress={close} />
      </BottomSheetModal>
    </>
  );
}

import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Icon } from '../../ui';
import { BottomSheetButton, pushBottomSheet } from '../bottom-sheet';
import InputBase from '../InputBase';
import { StyleProp, ViewStyle } from 'react-native';
import MenuItem from '../menus/MenuItem';
import { useTranslation } from 'react-i18next';
import number from '~/common/helpers/number';
import { useGifts } from '~/common/hooks/useGifts';
import sp from '~/services/serviceProvider';

type CashSelectorProps = {
  methodSelected: MethodKey;
  onMethodSelected: (method: MethodKey) => void;
  style?: StyleProp<ViewStyle>;
  borderless?: boolean;
};

export const CashSelector = observer(
  ({
    onMethodSelected,
    methodSelected,
    ...inputSelectorProps
  }: CashSelectorProps) => {
    const theme = sp.styles.style;
    const { methods, selected, setSelected } = useSelectMethod(methodSelected);
    const singleItem = methods.length === 1;

    const selectMethod = (method: Method) => {
      setSelected(method);
      onMethodSelected(method.key);
    };

    const onPress = singleItem
      ? undefined
      : () => {
          pushCardSelectorBottomSheet({ methods, selected, selectMethod });
        };

    return (
      <InputBase
        onPress={onPress}
        {...inputSelectorProps}
        label={sp.i18n.t('orderReport.paymentMethod')}
        labelStyle={[theme.colorPrimaryText, theme.fontBold]}
        value={selected.name}
        valueStyle={[theme.colorSecondaryText, theme.fontM]}
        icon={singleItem ? null : <Icon name="chevron-down" />}
      />
    );
  },
);

type MethodKey = 'iap' | 'gifts';
type Method = {
  key: MethodKey;
  name: string;
};
const useSelectMethod = (methodSelected: MethodKey) => {
  const { t } = useTranslation();
  const methods = [
    {
      key: 'iap',
      name: t('Use In-App Purchase'),
    },
  ] as Method[];

  const { balance } = useGifts();

  if (methodSelected === 'gifts') {
    methods.unshift({
      key: 'gifts',
      name: t('Gift Cards (${{value}} Credits)', {
        value: number(balance ?? 0, 2, 2),
      }),
    });
  }
  const [selected, setSelected] = useState(methods[0]);

  return {
    methods,
    selected,
    setSelected,
  };
};

type CardSelectorArgs = {
  methods: Method[];
  selected: Method;
  selectMethod: (method: Method) => void;
};
const pushCardSelectorBottomSheet = ({
  methods,
  selected,
  selectMethod,
}: CardSelectorArgs) => {
  return pushBottomSheet({
    safe: true,
    component: bottomSheetRef => (
      <>
        {methods.map(method => (
          <MenuItem
            key={method.key}
            borderless
            noIcon
            title={method.name}
            titleStyle={
              selected === method ? sp.styles.style.colorLink : undefined
            }
            onPress={() => {
              selectMethod(method);
              bottomSheetRef.close();
            }}
          />
        ))}
        <BottomSheetButton
          text={sp.i18n.t('cancel')}
          onPress={() => bottomSheetRef.close()}
        />
      </>
    ),
  });
};

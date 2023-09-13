import { observer } from 'mobx-react';
import React, { useState } from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import i18n from '../../services/i18n.service';
import { Icon } from '../../ui';
import { BottomSheetButton, pushBottomSheet } from '../bottom-sheet';
import InputBase from '../InputBase';
import { StyleProp, ViewStyle } from 'react-native';
import MenuItem from '../menus/MenuItem';
import {
  GiftCardProductIdEnum,
  useFetchPaymentMethodsQuery,
} from '~/graphql/api';
import { useTranslation } from 'react-i18next';
import number from '~/common/helpers/number';

type CashSelectorProps = {
  onMethodSelected: (method: string) => void;
  style?: StyleProp<ViewStyle>;
  borderless?: boolean;
};

export const CashSelector = observer(
  ({ onMethodSelected, ...inputSelectorProps }: CashSelectorProps) => {
    const theme = ThemedStyles.style;
    const total = 300;
    const { methods, selected, setSelected } = useSelectMethod(total);
    const singleItem = methods.length === 1;

    const selectMethod = (method: string) => {
      console.log('Select method', method);
      setSelected(method);
      onMethodSelected(method);
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
        label={i18n.t('orderReport.paymentMethod')}
        labelStyle={[theme.colorPrimaryText, theme.fontBold]}
        value={selected}
        valueStyle={[theme.colorSecondaryText, theme.fontM]}
        icon={singleItem ? null : <Icon name="chevron-down" />}
      />
    );
  },
);

const useSelectMethod = (total: number) => {
  const { t } = useTranslation();
  const methods = [t('Use In-App Purchase')] as string[];

  const { data } = useFetchPaymentMethodsQuery({
    giftCardProductId: GiftCardProductIdEnum.Boost,
  });

  const balance = data?.paymentMethods?.[0]?.balance ?? -1;

  const hasCredits = Number(balance) >= Number(total);
  if (!hasCredits) {
    const creditLabel = t('Gift Cards (${{value}} Credits)', {
      value: number(balance || 0, 2, 2),
    });
    methods.unshift(creditLabel);
  }
  const [selected, setSelected] = useState(methods[0]);

  return {
    methods,
    selected,
    setSelected,
  };
};

type CardSelectorArgs = {
  methods: string[];
  selected: string;
  selectMethod: (method: string) => void;
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
            borderless
            noIcon
            title={method}
            titleStyle={
              selected === method ? ThemedStyles.style.colorLink : undefined
            }
            onPress={() => {
              console.log('Press', method);
              selectMethod(method);
              bottomSheetRef.close();
            }}
          />
        ))}
        <BottomSheetButton
          text={i18n.t('cancel')}
          onPress={() => bottomSheetRef.close()}
        />
      </>
    ),
  });
};

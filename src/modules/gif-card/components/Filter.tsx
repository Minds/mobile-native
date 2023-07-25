import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import i18n from '~/common/services/i18n.service';
import {
  BottomSheetModal,
  BottomSheetButton,
  RadioButton,
  SectionTitle,
} from '~/common/components/bottom-sheet';
import { B3, Icon, Row } from '~ui';
import { GiftCardStatusFilterEnum } from '~/graphql/api';

type CreditFilterType = keyof typeof GiftCardStatusFilterEnum;

type PropsType = {
  filterState: CreditFilterType;
  setFilterState: (state: CreditFilterType) => void;
};

const Filter = observer(({ filterState, setFilterState }: PropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);

  const onPress = (state: CreditFilterType) => () => {
    close();
    setTimeout(() => {
      setFilterState?.(state);
    }, 200);
  };

  return (
    <>
      <TouchableOpacity onPress={show} testID="FilterToggle">
        <Row align="centerBoth">
          <Icon name="filter" size="small" />
          <B3 left="XXS" color="secondary">
            {i18n.t('filter')}
          </B3>
        </Row>
      </TouchableOpacity>
      <BottomSheetModal ref={ref}>
        <SectionTitle>Status</SectionTitle>
        <RadioButton
          selected={filterState === 'Active'}
          title="Active"
          onPress={onPress('Active')}
        />
        <RadioButton
          selected={filterState === 'Expired'}
          title="Expired"
          onPress={onPress('Expired')}
        />
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheetModal>
    </>
  );
});

export const useFilterState = (forceActive: boolean) => {
  const [gitfCardState, setGiftCardState] =
    React.useState<CreditFilterType>('Active');

  const statusFilter = forceActive ? 'Active' : gitfCardState;

  return {
    gitfCardState,
    setGiftCardState,
    statusFilter,
  };
};

export default Filter;

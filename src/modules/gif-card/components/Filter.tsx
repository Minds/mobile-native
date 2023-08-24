import { observer } from 'mobx-react';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetButton,
  RadioButton,
  SectionTitle,
} from '~/common/components/bottom-sheet';
import { B3, Icon, Row } from '~ui';
import { GiftCardStatusFilterEnum } from '~/graphql/api';
import { useTranslation } from '../locales';

type CreditFilterType = keyof typeof GiftCardStatusFilterEnum;

type PropsType = {
  filterState: CreditFilterType;
  setFilterState: (state: CreditFilterType) => void;
};

const Filter = observer(({ filterState, setFilterState }: PropsType) => {
  const { t } = useTranslation();

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
            {t('Filter')}
          </B3>
        </Row>
      </TouchableOpacity>
      <BottomSheetModal ref={ref}>
        <SectionTitle>{t('Status')}</SectionTitle>
        <RadioButton
          selected={filterState === 'Active'}
          title={t('Active')}
          onPress={onPress('Active')}
        />
        <RadioButton
          selected={filterState === 'Expired'}
          title={t('Expired')}
          onPress={onPress('Expired')}
        />
        <BottomSheetButton text={t('Close')} onPress={close} />
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

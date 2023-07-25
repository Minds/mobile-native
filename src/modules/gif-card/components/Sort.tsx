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
import { useTranslation } from '../locales';

type CreditSortType = 'Ascending' | 'Descending'; // keyof typeof GiftCardStatusFilterEnum;

type PropsType = {
  sortState: CreditSortType;
  setSortState: (state: CreditSortType) => void;
};

const Sort = observer(({ sortState, setSortState }: PropsType) => {
  const { t } = useTranslation();
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    ref.current?.present();
  }, [ref]);

  const onPress = (state: CreditSortType) => () => {
    close();
    setTimeout(() => {
      setSortState?.(state);
    }, 200);
  };

  return (
    <>
      <TouchableOpacity onPress={show} testID="FilterToggle">
        <Row align="centerBoth">
          <Icon name="filter" size="small" />
          <B3 left="S" color="secondary">
            {t('Sort')}
          </B3>
        </Row>
      </TouchableOpacity>
      <BottomSheetModal ref={ref}>
        <SectionTitle>{t('Date')}</SectionTitle>
        <RadioButton
          selected={sortState === 'Ascending'}
          title={t('Ascending')}
          onPress={onPress('Ascending')}
        />
        <RadioButton
          selected={sortState === 'Descending'}
          title={t('Descending')}
          onPress={onPress('Descending')}
        />
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheetModal>
    </>
  );
});

export const useSortState = (forceActive = false) => {
  const [sortState, setSortState] = React.useState<CreditSortType>('Ascending');

  const statusSort = forceActive ? 'Ascending' : sortState;

  return {
    sortState,
    setSortState,
    statusSort,
  };
};

export default Sort;

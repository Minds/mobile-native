import React from 'react';
import { Keyboard, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import i18n from '../services/i18n.service';
import { useStyle } from '../../styles/ThemedStyles';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import BottomSheetModal from './bottom-sheet/BottomSheetModal';
import BottomSheetButton from './bottom-sheet/BottomSheetButton';
import RadioButton from './bottom-sheet/RadioButton';
import MText from './MText';
import NsfwToggle from './nsfw/NsfwToggle';
import { IS_FROM_STORE } from '~/config/Config';
import DateRangeFilter from './controls/DateRangeFilter';
import { SectionTitle } from './bottom-sheet';
import { Spacer } from '~ui';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type PropsType = {
  hideLabel?: boolean;
  nsfw?: boolean;
  dateRange?: boolean;
  store: {
    filter: string;
    range?: { from: Date; to: Date } | null;
    clearDateRange: () => void;
    setDateRange?: (a: any, b: any) => void;
    setFilter: Function;
    setNsfw?: Function;
    nsfw?: Array<number>;
  };
  containerStyles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

/**
 * Feed Filter selector
 */
const FeedFilter = (props: PropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    Keyboard.dismiss();
    ref.current?.present();
  }, [ref]);
  const setDateRange = React.useCallback(
    (a, b) => {
      if (props.store.setDateRange) {
        props.store.setDateRange(a, b);
      }
    },
    [props.store],
  );
  const iconStyle = useStyle('colorIcon');

  const options = React.useMemo(
    () =>
      ['all', 'images', 'videos', 'blogs'].map(f => ({
        title: i18n.t(`discovery.${f}`),
        onPress: () => {
          close();
          // we need to delay due to a bug on the bottomsheet that opens it again if rendered too fast
          setTimeout(() => {
            if (props.store && props.store.setFilter) {
              props.store.setFilter(f);
            }
          }, 1000);
        },
        selected: props.store.filter === f,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, props.store, props.store.filter],
  );

  const containerStyle = useStyle(
    'rowJustifyEnd',
    props.containerStyles as ViewStyle,
  );
  const textStyle = useStyle(
    'paddingLeft',
    { fontSize: 15 },
    props.textStyle as ViewStyle,
  );

  return (
    <>
      <TouchableOpacity
        style={containerStyle}
        onPress={show}
        testID="FilterToggle">
        <MdIcon name="filter-variant" size={18} style={iconStyle} />
        {!props.hideLabel && (
          <MText style={textStyle}>{i18n.t('filter')}</MText>
        )}
      </TouchableOpacity>
      <BottomSheetModal
        ref={ref}
        title={i18n.t('filter') + ' ' + i18n.t('feed')}>
        <BottomSheetScrollView>
          <SectionTitle>{i18n.t('type')}</SectionTitle>
          {options.map((b, i) => (
            <RadioButton {...b} key={i} />
          ))}
          <Spacer top="L" />
          {props.dateRange && (
            <>
              <SectionTitle>{i18n.t('wallet.date')}</SectionTitle>
              <DateRangeFilter
                onConfirm={setDateRange}
                clear={props.store.clearDateRange}
                filtered={Boolean(props.store.range)}
                startDate={
                  props.store.range?.from
                    ? new Date(props.store.range?.from)
                    : undefined
                }
                endDate={
                  props.store.range?.to
                    ? new Date(props.store.range?.to)
                    : undefined
                }
              />
            </>
          )}
          {!props.nsfw && IS_FROM_STORE && props.store.nsfw && (
            <NsfwToggle
              value={props.store.nsfw}
              onChange={v => props.store.setNsfw!(v)}
            />
          )}
          <BottomSheetButton text={i18n.t('close')} onPress={close} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default observer(FeedFilter);

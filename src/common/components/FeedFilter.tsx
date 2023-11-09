import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

import i18n from '~/common/services/i18n.service';
import NsfwToggle from '~/common/components/nsfw/NsfwToggle';
import { IS_FROM_STORE } from '~/config/Config';
import DateRangeFilter from '~/common/components/controls/DateRangeFilter';
import { SectionTitle, RadioButton } from '~/common/components/bottom-sheet';
import { Spacer } from '~ui';
import BaseFeedFilter from '~/common/components/feed-filters/BaseFeedFilter';

type PropsType = {
  hideLabel?: boolean;
  hideBlogs?: boolean;
  nsfw?: boolean;
  dateRange?: boolean;
  store: {
    filter: string;
    range?: { from: number; to: number } | null;
    clearDateRange?: () => void;
    setDateRange?: (a: any, b: any) => void;
    setFilter: Function;
    setNsfw?: Function;
    nsfw?: Array<number>;
  };
  containerStyles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const filters = ['all', 'images', 'videos', 'blogs'] as const;

/**
 * Feed Filter selector
 */
const FeedFilter = (props: PropsType) => {
  const { dismiss } = useBottomSheetModal();
  const setDateRange = React.useCallback(
    (a, b) => {
      if (props.store.setDateRange) {
        props.store.setDateRange(a, b);
      }
    },
    [props.store],
  );

  const options = React.useMemo(
    () =>
      filters
        .filter(filter => !(props.hideBlogs && filter === 'blogs'))
        .map(filter => ({
          title: i18n.t(`discovery.${filter}`),
          onPress: () => {
            dismiss();
            // we need to delay due to a bug on the bottomsheet that opens it again if rendered too fast
            setTimeout(() => {
              if (props.store && props.store.setFilter) {
                props.store.setFilter(filter);
              }
            }, 1000);
          },
          selected: props.store.filter === filter,
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dismiss, props.store, props.store.filter],
  );

  return (
    <BaseFeedFilter
      title={i18n.t('filter') + ' ' + i18n.t('feed')}
      containerStyles={props.containerStyles}
      textStyle={props.textStyle}
      hideLabel={props.hideLabel}>
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
    </BaseFeedFilter>
  );
};

export default FeedFilter;

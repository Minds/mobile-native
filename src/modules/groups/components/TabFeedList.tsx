import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { useHeaderTabContext } from 'showtime-tab-view';

import { TabFlashListScrollView } from './TabFlashListScrollView';
import type BaseModel from '~/common/BaseModel';
import {
  FeedListProps,
  FeedListV2,
} from '../../../common/components/FeedListV2';

export type TabFeedListProps<T extends BaseModel> = Omit<
  FeedListProps<T>,
  'renderScrollComponent'
> & {
  index: number;
};

function TabFeedListComponent<T extends BaseModel>(
  props: FeedListProps<T>,
  ref: React.Ref<FlashList<T>>,
) {
  const { scrollViewPaddingTop } = useHeaderTabContext();

  return (
    <FeedListV2
      {...props}
      renderScrollComponent={TabFlashListScrollView as any}
      contentContainerStyle={{ paddingTop: scrollViewPaddingTop }}
      ref={ref}
    />
  );
}

export const TabFeedList = React.forwardRef(TabFeedListComponent) as <
  T extends BaseModel,
>(
  props: TabFeedListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
  },
) => React.ReactElement;

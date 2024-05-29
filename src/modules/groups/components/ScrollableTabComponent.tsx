import React from 'react';
import { useHeaderTabContext } from '@showtime-xyz/tab-view';
import { TabFlashListScrollView } from './TabFlashListScrollView';

export default function ScrollableTabComponent({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { scrollViewPaddingTop } = useHeaderTabContext();
  return (
    <TabFlashListScrollView
      index={index}
      style={{ paddingTop: scrollViewPaddingTop }}>
      {children}
    </TabFlashListScrollView>
  );
}

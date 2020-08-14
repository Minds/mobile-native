import React, { useState, useCallback } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useLayout } from '@react-native-community/hooks';

/**
 * Scroll view that disable the scroll if content fits on it
 */
export default function FitScrollView(
  props: ScrollViewProps & { children: React.ReactNode },
) {
  const [contentHeight, setContentHeight] = useState(0);
  const onSizeChange = useCallback((w, h) => setContentHeight(h), [
    setContentHeight,
  ]);
  const { onLayout, ...layout } = useLayout();

  const shouldScroll = layout.height < contentHeight;

  return (
    <ScrollView
      onLayout={onLayout}
      onContentSizeChange={onSizeChange}
      scrollEnabled={shouldScroll}
      {...props}>
      {props.children}
    </ScrollView>
  );
}

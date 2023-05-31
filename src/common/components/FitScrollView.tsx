import React, { forwardRef, useCallback, useState } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useLayout } from '@react-native-community/hooks';
import ThemedStyles from '~/styles/ThemedStyles';

/**
 * Scroll view that disable the scroll if content fits on it
 */
function FitScrollView(
  props: ScrollViewProps & { children: React.ReactNode },
  ref,
) {
  const [contentHeight, setContentHeight] = useState(0);
  const onSizeChange = useCallback(
    (w, h) => setContentHeight(h),
    [setContentHeight],
  );
  const { onLayout, ...layout } = useLayout();
  const shouldScroll = layout.height < contentHeight;

  return (
    <ScrollView
      ref={ref}
      onLayout={onLayout}
      onContentSizeChange={onSizeChange}
      scrollEnabled={shouldScroll}
      style={props.style || ThemedStyles.style.flexContainer}
      {...props}
    />
  );
}

export default forwardRef(FitScrollView);

import React, { useCallback } from 'react';
import {
  RenderPassReport,
  PerformanceProfiler,
  LogLevel,
} from '@shopify/react-native-performance';
import { ListsProfiler } from '@shopify/react-native-performance-lists-profiler';
import { init, track } from '@amplitude/analytics-react-native';

import { IS_PERFMON_ENABLED } from '~/config/Config';
import * as Sentry from '@sentry/react-native';

init('KzXvNgAkRLNfYXlFXpGlJ_rTTv_4zMpj');

export function PerformanceProvider({
  children,
}: React.PropsWithChildren<any>) {
  const onReportPrepared = useCallback((report: RenderPassReport) => {
    // send report to analytics
    Sentry.captureMessage('minds_performance', {
      extra: (report as unknown) as Record<string, any>,
    });
    console.log('====================================');
    console.log('|             REPORT               |');
    console.log('====================================');
    track('minds_performance', report);
  }, []);

  const onInteractiveCallback = useCallback((TTI: number, listName: string) => {
    if (TTI > 0) {
      console.log(`${listName}'s TTI: ${TTI}`);
    }
  }, []);

  const onBlankAreaCallback = useCallback(
    (offsetStart: number, offsetEnd: number, listName: string) => {
      if (offsetStart > 0 || offsetEnd > 0) {
        console.log(
          `Blank area for ${listName}: ${Math.max(offsetStart, offsetEnd)}`,
        );
      }
    },
    [],
  );

  return IS_PERFMON_ENABLED ? (
    <PerformanceProfiler
      onReportPrepared={onReportPrepared}
      logLevel={LogLevel.Debug}>
      <ListsProfiler
        onInteractive={onInteractiveCallback}
        onBlankArea={onBlankAreaCallback}>
        {children}
      </ListsProfiler>
    </PerformanceProfiler>
  ) : (
    children
  );
}

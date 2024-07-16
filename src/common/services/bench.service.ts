import fbjsPerformanceNow from 'fbjs/lib/performanceNow';
const performanceNow = global.nativePerformanceNow || fbjsPerformanceNow;

export default function () {
  const start = performanceNow();
  return {
    timing: () => performanceNow() - start,
  };
}

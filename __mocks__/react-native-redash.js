const NOOP = () => undefined;

module.exports = {
  __esModule: true,

  useTimingTransition: NOOP,
  mix: NOOP,
  bin: NOOP,
  onGestureEvent: NOOP,
  useValues: (...a) => [a],
  onScrollEvent: NOOP,
  useTransition: NOOP,
};
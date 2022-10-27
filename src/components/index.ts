export { ErrorGlobalWrapper } from './errorGlobalWrapper';
export { ErrorSuspense } from './errorSuspense';
export { Widget } from './widget';

export type LoadingWrapper = {
  loadingStart: () => void;
  loadingStop: () => void;
};

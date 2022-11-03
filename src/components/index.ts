export { ErrorGlobalWrapper } from './ErrorGlobalWrapper';
export { ErrorSuspense } from './ErrorSuspense';
export { Widget } from './Widget';

export type LoadingWrapper = {
  loadingStart: () => void;
  loadingStop: () => void;
};

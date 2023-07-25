import React, { useContext, useMemo } from 'react';
import { ActivityProps } from '../Activity';

type ActivityContextType = {
  quietDownvote?: boolean;
  explicitVoteButtons?: boolean;
  hidePostOnDownvote?: boolean;
  onDownvote?: () => void;
};

const ActivityContext = React.createContext<ActivityContextType | undefined>(
  {},
);

const useActivityContext = () => useContext(ActivityContext)!;

function withActivityContext(
  contextResolver?: (props: ActivityProps) => any | null | undefined,
) {
  return (WrappedComponent: any) =>
    React.forwardRef((props: ActivityProps, ref: React.Ref<ActivityProps>) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const context = useMemo(() => contextResolver?.(props), [props.entity]);

      return (
        <ActivityContext.Provider value={context}>
          <WrappedComponent {...props} ref={ref} />
        </ActivityContext.Provider>
      );
    }) as any;
}

export { ActivityContext, withActivityContext, useActivityContext };

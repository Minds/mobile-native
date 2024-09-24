import React, { useCallback, useState } from 'react';
import TurboImage, { TurboImageProps } from 'react-native-turbo-image';

/**
 * A fast image wrapper that add retry functionality
 * @param {Object} props
 */
export default function (
  props: TurboImageProps & { retry?: number; onError?: (error: Error) => void },
) {
  const { onError, ...otherProps } = props;
  const [retries, setRetries] = useState(0);

  const errorHandler = useCallback(
    error => {
      const maxRetries = props.retry || 3;
      if (retries < maxRetries) {
        setRetries(retries + 1);
      } else {
        onError?.(error);
      }
    },
    [props.retry, retries, onError],
  );

  return <TurboImage key={retries} onFailure={errorHandler} {...otherProps} />;
}

import React, { useCallback, useState } from 'react';
import { Image, ImageProps } from 'expo-image';

/**
 * A fast image wrapper that add retry functionality
 * @param {Object} props
 */
export default function (props: ImageProps & { retry?: number }) {
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

  return <Image key={retries} onError={errorHandler} {...otherProps} />;
}

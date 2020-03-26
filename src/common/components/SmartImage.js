import React, { useCallback, useState } from 'react';
import FastImage from 'react-native-fast-image';

/**
 * A fast image wrapper that add retry functionality
 * @param {Object} props
 */
export default function(props) {
  const { onError, ...otherProps } = props;
  const [retries, setRetries] = useState(0);

  const errorHandler = useCallback(
    error => {
      const maxRetries = props.retry || 3;
      if (retries < maxRetries) {
        setRetries(retries + 1);
      } else {
        onError(error);
      }
    },
    [props.retry, retries, onError],
  );

  return <FastImage key={retries} onError={errorHandler} {...otherProps} />;
}

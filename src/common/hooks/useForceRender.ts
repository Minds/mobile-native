import React from 'react';

/**
 * Forces a re-render of the component.
 */
export default function useForceRender() {
  return React.useReducer(bool => !bool, false)[1];
}

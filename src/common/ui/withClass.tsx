import React from 'react';

/**
 * This was mainly created for a wrapper to be used together with the motify lib
 * as it breaks when used with functional ui components
 */

function withClass(WrappedComponent: any) {
  return class Component extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withClass;

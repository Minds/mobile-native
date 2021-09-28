import React from 'react';

function withClass(WrappedComponent) {
  return class Component extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

export default withClass;

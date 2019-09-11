import React, { Component } from 'react';
import { TextInput } from 'react-native';

/**
 * Workaround for copy/paste issue on android
 * https://github.com/facebook/react-native/issues/20887
 */
export default class AlternativeTextInput extends React.Component<Props, State> {

  static defaultProps = {
    editable: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      editable: !props.editable
    };
  }

  componentDidMount() {
    if (this.props.editable) {
      setTimeout(() => {
        this.setState({ editable: true });
      }, 100);
    }
  }

  render() {
    const { editable } = this.state;
    return <TextInput {...this.props} editable={editable} />;
  }
}
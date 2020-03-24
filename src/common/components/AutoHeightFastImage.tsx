import React, { PureComponent } from 'react';
import { Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';

const { source, resizeMode, ...autoHeightImagePropTypes } = Image.propTypes;

export const NOOP = () => {};
export const DEFAULT_WIDTH = 0;
export const DEFAULT_HEIGHT = 0;

const ProgressFastImage = createImageProgress(FastImage);

/**
 * based in https://github.com/vivaxy/react-native-auto-height-image
 * But implemented using FastImage
 * TODO: use fastimage OnLoad when sending size it is implemented
 */
export default class AutoHeightFastImage extends PureComponent {

  static propTypes = {
    ...autoHeightImagePropTypes,
    width: PropTypes.number.isRequired,
    onHeightChange: PropTypes.func,
  };

  static defaultProps = {
    onHeightChange: NOOP,
  };

  constructor(props) {
    super(props);
    this.setInitialImageHeight();
  }

  async componentDidMount() {
    this.hasMounted = true;
    await this.updateImageHeight(this.props);
  }

  async componentWillReceiveProps(nextProps) {
    await this.updateImageHeight(nextProps);
  }

  componentWillUnmount() {
    this.hasMounted = false;
  }

  setInitialImageHeight() {
    const { width, onHeightChange } = this.props;
    const height = DEFAULT_HEIGHT;
    this.state = { height };
    this.styles = StyleSheet.create({ image: { width, height } });
    onHeightChange(height);
  }

  getImageSizeFitWidth(imageURL, toWidth) {
    return new Promise((resolve, reject) => {
      Image.getSize(imageURL, (width, height) => {
        // success
        resolve ({ width: toWidth, height: toWidth * height / width });
      }, reject);
    });
  }

  async updateImageHeight(props) {
    if (
      this.state.height === DEFAULT_HEIGHT ||
      this.props.width !== props.width
    ) {
      // image height could not be `0`
      const { source, width, onHeightChange } = props;
      try {
        const { height } = await this.getImageSizeFitWidth(source.uri, width);
        this.styles = StyleSheet.create({ image: { width, height } });
        if (this.hasMounted) {
          // guard `this.setState` to be valid
          this.setState({ height });
          onHeightChange(height);
        }
      } catch (ex) {
        // Might be Image.getSize error, we ignore it here.
      }
    }
  }

  render() {
    // remove `width` prop from `restProps`
    const { source, style, width, ...restProps } = this.props;
    return (
      <ProgressFastImage
        indicator={ProgressCircle}
        threshold={150}
        source={source}
        style={[this.styles.image, style]}
        {...restProps}
      />
    );
  }
}
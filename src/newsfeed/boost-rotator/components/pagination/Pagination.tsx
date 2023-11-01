import React, { PureComponent } from 'react';
import {
  I18nManager,
  Platform,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import styles from './Pagination.style';
import PaginationDot from './PaginationDot';

const IS_IOS = Platform.OS === 'ios';
const IS_RTL = I18nManager.isRTL;

interface PaginationProps {
  activeDotIndex: number;
  dotsLength: number;
  activeOpacity?: number;
  carouselRef?: any;
  containerStyle?: ViewStyle;
  dotColor: string;
  dotContainerStyle?: ViewStyle;
  dotElement?: any;
  dotStyle?: ViewStyle;
  inactiveDotColor: string;
  inactiveDotElement?: any;
  inactiveDotOpacity?: number;
  inactiveDotScale?: number;
  inactiveDotStyle?: ViewStyle;
  renderDots?: (
    activeDotIndex: number,
    dotsLength: number,
    paginationRef: Pagination,
  ) => React.ReactNode;
  tappableDots?: boolean;
  vertical?: boolean;
  accessibilityLabel?: string;
  animatedDuration?: number;
  animatedFriction?: number;
  animatedTension?: number;
  delayPressInDot?: number;
}

export default class Pagination extends PureComponent<PaginationProps> {
  static defaultProps = {
    inactiveDotOpacity: 0.5,
    inactiveDotScale: 0.95,
    tappableDots: false,
    vertical: false,
    animatedDuration: 0,
    animatedFriction: 4,
    animatedTension: 50,
    delayPressInDot: 0,
  };

  constructor(props) {
    super(props);

    // Warnings
    if (
      (props.dotColor && !props.inactiveDotColor) ||
      (!props.dotColor && props.inactiveDotColor)
    ) {
      console.warn(
        'react-native-snap-carousel | Pagination: ' +
          'You need to specify both `dotColor` and `inactiveDotColor`',
      );
    }
    if (
      (props.dotElement && !props.inactiveDotElement) ||
      (!props.dotElement && props.inactiveDotElement)
    ) {
      console.warn(
        'react-native-snap-carousel | Pagination: ' +
          'You need to specify both `dotElement` and `inactiveDotElement`',
      );
    }
    if (props.tappableDots && props.carouselRef === undefined) {
      console.warn(
        'react-native-snap-carousel | Pagination: ' +
          'You must specify prop `carouselRef` when setting `tappableDots` to `true`',
      );
    }
  }

  _needsRTLAdaptations() {
    const { vertical } = this.props;
    return IS_RTL && !IS_IOS && !vertical;
  }

  get _activeDotIndex() {
    const { activeDotIndex, dotsLength } = this.props;
    return this._needsRTLAdaptations()
      ? dotsLength - activeDotIndex - 1
      : activeDotIndex;
  }

  get dots() {
    const {
      activeOpacity,
      carouselRef,
      dotsLength,
      dotColor,
      dotContainerStyle,
      dotElement,
      dotStyle,
      inactiveDotColor,
      inactiveDotElement,
      inactiveDotOpacity,
      inactiveDotScale,
      inactiveDotStyle,
      renderDots,
      tappableDots,
      animatedDuration,
      animatedFriction,
      animatedTension,
      delayPressInDot,
    } = this.props;

    if (renderDots) {
      return renderDots(this._activeDotIndex, dotsLength, this);
    }

    const DefaultDot = (
      <PaginationDot
        carouselRef={carouselRef}
        tappable={tappableDots && typeof carouselRef !== 'undefined'}
        activeOpacity={activeOpacity}
        color={dotColor}
        containerStyle={dotContainerStyle}
        style={dotStyle}
        inactiveColor={inactiveDotColor}
        inactiveOpacity={inactiveDotOpacity!}
        inactiveScale={inactiveDotScale!}
        inactiveStyle={inactiveDotStyle}
        animatedDuration={animatedDuration}
        animatedFriction={animatedFriction}
        animatedTension={animatedTension}
        delayPressInDot={delayPressInDot}
      />
    );

    const dots = [...Array(dotsLength).keys()].map(i => {
      const isActive = i === this._activeDotIndex;
      return React.cloneElement(
        (isActive ? dotElement : inactiveDotElement) || DefaultDot,
        {
          key: `pagination-dot-${i}`,
          active: isActive,
          index: i,
        },
      );
    });

    return dots;
  }

  render() {
    const { dotsLength, containerStyle, vertical, accessibilityLabel } =
      this.props;

    if (!dotsLength || dotsLength < 2) {
      return false;
    }

    const style: StyleProp<ViewStyle> = [
      styles.sliderPagination,
      {
        flexDirection: vertical
          ? 'column'
          : this._needsRTLAdaptations()
          ? 'row-reverse'
          : 'row',
      },
      containerStyle || {},
    ];

    return (
      <View
        pointerEvents={'box-none'}
        style={style}
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}>
        {this.dots}
      </View>
    );
  }
}

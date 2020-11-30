//credits to: https://github.com/879479119/react-native-shadow/blob/master/lib/TopShadow.js
import React, { Component } from 'react';
import { ViewStyle } from 'react-native';
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  RadialGradient,
  Path,
} from 'react-native-svg';

type PropsType = {
  setting: any;
};

export default class TopShadow extends Component<PropsType> {
  render = () => {
    //get the shadow settings and give them default values
    const {
      setting: {
        width = 0,
        height = 0,
        color = '#000',
        border = 0,
        radius = 0,
        opacity = 1,
        x = 0,
        y = 0,
      },
    } = this.props;

    //define the lengths
    const lineWidth = border,
      rectWidth = width - radius * 2;

    //the same parts for gradients
    const linear = (key) => {
      return [
        <Stop
          offset="0"
          stopColor={color}
          stopOpacity={opacity}
          key={key + 'Linear0'}
        />,
        <Stop
          offset="1"
          stopColor={color}
          stopOpacity="0"
          key={key + 'Linear1'}
        />,
      ];
    };
    const radial = (key) => {
      return [
        <Stop
          offset="0"
          stopColor={color}
          stopOpacity={opacity}
          key={key + 'Radial0'}
        />,
        <Stop
          offset={(radius / (lineWidth + radius)).toString()}
          stopColor={color}
          stopOpacity={opacity}
          key={key + 'Radial1'}
        />,
        <Stop
          offset="1"
          stopColor={color}
          stopOpacity="0"
          key={key + 'Radial2'}
        />,
      ];
    };

    const outerWidth = lineWidth + radius;
    const svgStyle = {
      position: 'absolute',
      top: y - lineWidth,
      left: x - lineWidth,
    } as ViewStyle;
    //return a view ,whose background is a svg picture
    return (
      <Svg
        height={height + lineWidth * 2 + radius * 2}
        width={width + lineWidth * 2 + radius * 2}
        style={svgStyle}>
        <Defs>
          <LinearGradient id="top" x1="0%" x2="0%" y1="100%" y2="0%">
            {linear('BoxTop')}
          </LinearGradient>

          <RadialGradient
            id="border-left-top"
            r="100%"
            cx="100%"
            cy="100%"
            fx="100%"
            fy="100%">
            {radial('BoxLeftTop')}
          </RadialGradient>
          <RadialGradient
            id="border-right-top"
            r="100%"
            cx="0%"
            cy="100%"
            fx="0%"
            fy="100%">
            {radial('BoxRightTop')}
          </RadialGradient>
        </Defs>

        <Path
          d={`M 0 ${outerWidth},Q 0 0 ${outerWidth} 0,v ${lineWidth},q ${-radius} 0 ${-radius} ${radius},h ${-lineWidth},z`}
          fill="url(#border-left-top)"
        />
        <Path
          d={`M ${
            rectWidth + lineWidth + radius
          } 0,q ${outerWidth} 0 ${outerWidth} ${outerWidth},h ${-lineWidth},q 0 ${-radius} ${-radius} ${-radius},v ${-lineWidth},z`}
          fill="url(#border-right-top)"
        />
        <Rect
          x={outerWidth}
          y="0"
          width={rectWidth}
          height={lineWidth}
          fill="url(#top)"
        />
      </Svg>
    );
  };
}

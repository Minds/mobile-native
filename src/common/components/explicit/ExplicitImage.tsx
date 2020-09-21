//@ts-nocheck
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import type { FastImageProperties, Source } from 'react-native-fast-image';
import { CommonStyle } from '../../../styles/Common';
import ThemedStyles from '../../../styles/ThemedStyles';
import type BaseModel from '../../BaseModel';

import SmartImage from '../SmartImage';

interface PropsType extends FastImageProperties {
  onLoadEnd: () => void;
  source: Source;
  onError: (error: any) => void;
  entity?: BaseModel;
  ignoreDataSaver?: boolean;
}

@observer
export default class ExplicitImage extends Component<
  PropsType,
  { ready: boolean }
> {
  state = {
    ready: false,
  };

  render() {
    const theme = ThemedStyles.style;
    // do not show image if it is mature
    if (
      this.props.entity.shouldBeBlured() &&
      !this.props.entity.mature_visibility
    ) {
      return (
        <View
          style={[
            theme.positionAbsolute,
            this.props.imageStyle,
            CommonStyle.blackOverlay,
          ]}
        />
      );
    }

    if (
      !this.props.source ||
      !this.props.source.uri ||
      this.props.source.uri.indexOf('//') < 0
    ) {
      return <View />;
    }

    return (
      <SmartImage
        {...this.props}
        ignoreDataSaver={
          this.props.ignoreDataSaver ||
          (this.props.entity && this.props.entity.paywall)
        }
        style={[theme.positionAbsolute, this.props.style]}
      />
    );
  }
}

import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import type { FastImageProps, Source } from 'react-native-fast-image';
import type ActivityModel from '../../../newsfeed/ActivityModel';
import ThemedStyles from '../../../styles/ThemedStyles';

import SmartImage from '../SmartImage';

interface PropsType extends FastImageProps {
  source: Source;
  thumbnail?: Source;
  entity?: ActivityModel;
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
    // do not show image if it is mature
    if (
      this.props.entity &&
      this.props.entity.shouldBeBlured() &&
      !this.props.entity.mature_visibility
    ) {
      return <View style={overlayStyle} />;
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
          Boolean(this.props.entity && this.props.entity.paywall)
        }
      />
    );
  }
}

const overlayStyle = ThemedStyles.combine(
  'positionAbsolute',
  'backgroundBlack',
);

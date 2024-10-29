import { MotiView, useAnimationState } from 'moti';
import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';

import SmartImage from '../common/components/SmartImage';
import mediaProxyUrl from '../common/helpers/media-proxy-url';
import sp from '~/services/serviceProvider';

import type ActivityModel from './ActivityModel';

type PropsType = {
  entity: ActivityModel;
  size: number;
  navigation: any;
};

const transitionConfig: any = {
  type: 'timing',
};

function Container({
  children,
  ready,
}: {
  children: React.ReactNode;
  ready: boolean;
}) {
  const animationState = useAnimationState({
    from: {
      opacity: 0,
      scale: 0.7,
    },
    shown: {
      opacity: 1,
      scale: 1,
    },
  });

  React.useEffect(() => {
    if (ready) {
      animationState.transitionTo('shown');
    }
  }, [ready, animationState]);

  return (
    <MotiView state={animationState} transition={transitionConfig}>
      {children}
    </MotiView>
  );
}

export default class TileElement extends PureComponent<
  PropsType,
  { ready: boolean; source: any }
> {
  style: any;
  containerStyle: any;
  /**
   * Navigate to view
   */
  _navToView = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Activity', { entity: this.props.entity });
    }
  };

  constructor(props) {
    super(props);
    const source = this.props.entity.getThumbSource();
    const type = this.props.entity.custom_type || this.props.entity.subtype;
    if (type === 'video') {
      source.uri = mediaProxyUrl(source.uri, 300);
    }
    this.state = {
      source,
      ready: false,
    };
    this.style = { width: this.props.size, height: this.props.size };
    this.containerStyle = sp.styles.combine(
      {
        width: this.props.size,
        height: this.props.size,
      },
      'bgSecondaryBackground',
      'borderHair',
      'bcolorPrimaryBorder',
    );
  }

  onLoadEnd = () => {
    this.setState({ ready: true });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._navToView} style={this.containerStyle}>
        <Container ready={this.state.ready}>
          <SmartImage
            source={this.state.source}
            style={this.style}
            onLoadEnd={this.onLoadEnd}
          />
        </Container>
      </TouchableOpacity>
    );
  }
}

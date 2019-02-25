import React from 'react';
import { View, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import Pulse from './Pulse';

import FastImage from 'react-native-fast-image';

/**
 * Based on https://github.com/wissile/react-native-pulse-anim
 */
export default class PulseAnimAvatar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			circles: []
		};

		this.counter = 1;
		this.setInterval = null;
		this.anim = new Animated.Value(1);
	}

	componentDidMount() {
		this.setCircleInterval();
	}

	componentWillUnmount() {
		clearInterval(this.setInterval);
	}

	setCircleInterval() {
		this.setInterval = setInterval(this.addCircle.bind(this), this.props.interval);
		this.addCircle();
	}

	addCircle() {
		this.setState({ circles: [...this.state.circles, this.counter] });
		this.counter++;
	}

	onPressIn() {
		Animated.timing(this.anim, {
			toValue: this.props.pressInValue,
			duration: this.props.pressDuration,
      easing: this.props.pressInEasing,
		}).start(() => clearInterval(this.setInterval));
	}

	onPressOut() {
		Animated.timing(this.anim, {
			toValue: 1,
			duration: this.props.pressDuration,
      easing: this.props.pressOutEasing,
		}).start(this.setCircleInterval.bind(this));
	}

	render() {
		const { size, avatar, avatarBackgroundColor, interval, onPress } = this.props;

		return (
			<View style={{
				// flex: 1,
				backgroundColor: 'transparent',
				// width: size,
				// height: size,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
				{this.state.circles.map((circle) => (
					<Pulse
						key={circle}
						{...this.props}
					/>
				))}

				<TouchableOpacity
					activeOpacity={.5}
					// onPressIn={this.onPressIn.bind(this)}
          // onPressOut={this.onPressOut.bind(this)}
          onPress={onPress}
					style={{
							width: size,
							height: size,
					}}
				>
					<FastImage
						source={{ uri: avatar }}
						style={{
							width: size,
							height: size,
							borderRadius: size/2,
							backgroundColor: avatarBackgroundColor,
							...this.props.style
						}}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

PulseAnimAvatar.defaultProps = {
  interval: 2000,
  size: 100,
  pulseMaxSize: 200,
  avatar: undefined,
  avatarBackgroundColor: 'transparent',
  pressInValue: 0.8,
  pressDuration: 150,
  pressInEasing: Easing.in,
  pressOutEasing: Easing.in,
  borderColor: '#1c1d1f',
  backgroundColor: '#D1D1D1',
  getStyle: undefined,
};
//@ts-nocheck
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';

let radiusOfHolder = 5;
let radiusOfActiveHolder = 7;

export default class ProgressBar extends Component {
  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.state = {
      lineX: new Animated.Value(0),
      slideX: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.moving) {
      this.state.slideX.setValue(this.computeScreenX(nextProps.percent));
    }
  }

  computeScreenX(percent) {
    return (percent * this.state.width) / 100;
  }

  componentWillMount() {
    this.holderPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
        let { slideX } = this.state;
        this.setState({ moving: true });
        slideX.setOffset(slideX._value);
        slideX.setValue(0);
      },
      onPanResponderMove: (e, gestureState) => {
        let totalX = this.state.slideX._offset + gestureState.dx;
        let newPercent = (totalX / this.state.width) * 100;
        this.notifyPercentChange(newPercent, true);
        Animated.event([null, { dx: this.state.slideX }])(e, gestureState);
      },
      onPanResponderRelease: (e, gesture) => {
        this.state.slideX.flattenOffset();
        let newPercent = (this.state.slideX._value / this.state.width) * 100;
        this.setState({ moving: false });
        this.notifyPercentChange(newPercent, false);
      },
    });
  }

  notifyPercentChange(newPercent, paused) {
    let { onNewPercent } = this.props;
    if (onNewPercent instanceof Function) {
      onNewPercent(newPercent, paused);
    }
  }

  onLayout(e) {
    this.setState({ width: e.nativeEvent.layout.width - radiusOfHolder * 2 });
  }

  getHolderStyle() {
    let { moving, slideX, width } = this.state;
    return [styles.holder];
    if (width > 0) {
      var interpolatedAnimation = slideX.interpolate({
        inputRange: [0, width],
        outputRange: [0, width],
        extrapolate: 'clamp',
      });
      return [
        styles.holder,
        moving && styles.activeHolder,
        { transform: [{ translateX: interpolatedAnimation }] },
      ];
    } else {
      return [styles.holder];
    }
  }

  onLinePressed(e) {
    let newPercent = (e.nativeEvent.locationX / this.state.width) * 100;
    this.notifyPercentChange(newPercent, false);
  }

  formatSeconds(seconds = 0) {
    let { duration = 0 } = this.props;
    seconds = parseFloat(seconds, 0);
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (
      _.padStart(minutes.toFixed(0), 2, 0) +
      ':' +
      _.padStart(remainingSeconds.toFixed(0), 2, 0)
    );
  }

  render() {
    let { moving } = this.state;
    let { currentTime, duration, percent } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text style={[styles.timeText, { marginRight: 10 }]}>
            {this.formatSeconds(currentTime)}
          </Text>
          <View
            style={styles.barView}
            onLayout={this.onLayout.bind(this)}
            {...this.holderPanResponder.panHandlers}>
            <TouchableOpacity
              style={[
                styles.line,
                { flex: percent, borderColor: colors.primary },
              ]}
              onPress={this.onLinePressed.bind(this)}
            />
            <TouchableOpacity
              style={[
                styles.line,
                { flex: 100 - percent, borderColor: colors.light },
              ]}
              onPress={this.onLinePressed.bind(this)}
            />
          </View>
          <Text style={[styles.timeText, { marginLeft: 10 }]}>
            {this.formatSeconds(duration)}
          </Text>
        </View>
      </View>
    );
  }
}

let height = 3;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height,
    alignItems: 'center',
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  barView: {
    flex: 1,
    height,
    flexDirection: 'row',
  },
  timeText: {
    color: 'white',
  },
  line: {
    borderWidth: 3,
    padding: 0,
  },
  holder: {
    height: radiusOfHolder * 2,
    width: radiusOfHolder * 2,
    borderRadius: radiusOfHolder,
    backgroundColor: 'white',
  },
  activeHolder: {
    height: radiusOfActiveHolder * 2,
    width: radiusOfActiveHolder * 2,
    borderRadius: radiusOfActiveHolder,
    backgroundColor: 'white',
  },
});

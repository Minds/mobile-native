import React, {
  PureComponent
} from 'react';

import PropTypes from 'prop-types';

import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonStyle as CS } from '../../styles/Common';
import colors from '../../styles/Colors';
import Rectangle from './shapes/Rectangle';
import featuresService from '../services/features.service';

// types
type Props = {
  // header?: any,
  steps: any,
  // onNext?: Function,
  // onPrevious?: Function,
  onFinish?: Function
};

type State = {
  current: number,
  waitingNext: boolean
}

/**
 * Wizar component
 */
export default class Wizard extends PureComponent<Props, State>  {

  /**
   * state
   */
  state = {
    current: 0,
    waitingNext: false
  }

  /**
   * Get header
   */
  getHeader() {
    let ready = true;

    const step = this.props.steps[this.state.current];
    const first = this.state.current === 0;

    if (step.ready && !step.ready()) ready = false;

    return (
      <View style={[CS.rowJustifyCenter, CS.backgroundWhite, CS.padding2x, CS.marginTop4x, CS.marginBottom4x]}>
        {first ?
          <View style={{width:50}}/> :
          <TouchableOpacity style={[{width:50}, CS.centered]} onPress={this.previous} testID="wizardPrevious">
            <Icon size={34} name="keyboard-arrow-left" color={colors.primary}/>
          </TouchableOpacity>}
        <View style={[CS.flexContainer, CS.centered]}>
          <Image source={require('./../../assets/logos/bulb.png')} style={{width:35, height:60}}/>
        </View>
        <TouchableOpacity style={[{width:50}, CS.centered]} onPress={this.next} disabled={!ready || this.state.waitingNext} testID="wizardNext">
          {
            this.state.waitingNext ? <ActivityIndicator size="small"/> :
            <Icon size={34} name="keyboard-arrow-right" color={ready ? colors.primary : colors.greyed}/>
          }
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Return to previous step
   */
  previous = () => {
    if (this.state.current === 0 ) return;

    const nextStep = this.props.steps[this.state.current - 1];
    if (nextStep.skip && nextStep.skip() && this.state.current > 1) {
      this.setState({current: this.state.current - 1}, () => this.previous());
      return;
    }

    this.setState({current: this.state.current - 1});
  }

  /**
   * Move to next step
   */
  next = async () => {
    if (this.state.current === this.props.steps.length - 1) {
      if (this.props.onFinish) this.props.onFinish();
      return;
    }
    const nextStep = this.props.steps[this.state.current + 1];
    const step = this.props.steps[this.state.current];

    if (nextStep.skip && nextStep.skip()) {
      this.setState({current: this.state.current + 1}, () => this.next());
      return;
    }

    if (step.onNext) {
      this.setState({waitingNext: true});
      try {
        await step.onNext();
      } catch (err) {
        throw(err);
      } finally {
        this.setState({waitingNext: false});
      }
    }

    this.setState({current: this.state.current + 1});
  }

  /**
   * Render
   */
  render() {
    const {steps} = this.props;

    let component;
    if (featuresService.has('onboarding-december-2019')) {
      component = (
        <View style={[CS.flexContainer]}>
          {this.props.steps[this.state.current].component}
        </View>
      );
    } else {
      component = (
        <ScrollView style={[CS.flexContainer, CS.backgroundWhite]}>
          {this.getHeader()}
          {this.props.steps[this.state.current].component}
        </ScrollView>
      );
    }

    return component;
  }
}
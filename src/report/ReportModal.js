import React, {
  Component
} from 'react';

import IonIcon from 'react-native-vector-icons/Ionicons';

import {
  MINDS_URI
} from '../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
  View
} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import reportService from './ReportService';

import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';

const REASONS = [
  { value: 1 , label: 'Illegal' },
  { value: 2, label: 'Should be marked as explicit' },
  { value: 3, label: 'Encourages or incites violence' },
  { value: 4, label: 'Threatens, harasses, bullies or encourages others to do so' },
  { value: 5, label: 'Personal and confidential information' },
  { value: 6, label: 'Maliciously targets users (@name, links, images or videos)' },
  { value: 7, label: 'Impersonates someone in a misleading or deceptive manner' },
  { value: 8, label: 'Spam' },
  { value: 10, label: 'This infringes my copyright' },
  { value: 11, label: 'Another reason' }
];

export default class ReportModal extends Component {
  state = {
    value : 0,
    secondStep: false,
    reason: '',
    success: false,
  }

  showButton() {
    if ((this.state.value < 10 && !this.state.secondStep) || (this.state.value == 11 && this.state.secondStep)) {
      return  <TouchableHighlight
                onPress={() => { this.submit() }}
                underlayColor = 'transparent'
                style = {ComponentsStyle.bluebutton}
              >
                <Text style={{color: colors.primary}} > SUBMIT </Text>
              </TouchableHighlight>;
    } else if (this.state.value == 10 && this.state.secondStep) {
      return <TouchableHighlight
                onPress={() => { this.props.close() }}
                underlayColor = 'transparent'
                style = {ComponentsStyle.bluebutton}
              >
                <Text style={{color: colors.primary}} > CLOSE </Text>
              </TouchableHighlight>;
    } else {
      return  <TouchableHighlight
                onPress={() => { this.setState({secondStep:true}) }}
                underlayColor = 'transparent'
                style = {ComponentsStyle.bluebutton}
              >
                <Text style={{color: colors.primary}} > NEXT </Text>
              </TouchableHighlight>;
    }
  }

  showForm() {
    if (!this.state.secondStep) {
      return  <RadioForm
                formHorizontal={false}
                animation={true}
                style={{ alignItems: 'flex-start' }}
              >
                {REASONS.map((obj, i) => {
                  return <RadioButton labelHorizontal={true} key={i} >
                          <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={this.state.value === obj.value }
                            onPress={(value) => {this.setState({value:value})}}
                            borderWidth={1}
                            buttonInnerColor={this.state.value === obj.value ? colors.medium : '#fff'}
                            buttonOuterColor={this.state.value === obj.value ? colors.medium : '#000'}
                            buttonSize={7}
                            buttonOuterSize={8}
                            buttonStyle={{}}
                            buttonWrapStyle={{marginLeft: 5}}
                          />
                          <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={(value) => {this.setState({value:value})}}
                            labelStyle={{fontSize: 13, color: colors.dark}}
                            labelWrapStyle={{}}
                          />
                          </RadioButton>
                })}
                
              </RadioForm>
    } else if (this.state.secondStep && this.state.value == 10) {
      return  <Text style={{ marginTop:30, marginBottom:30 }}> Please submit a DMCA notice to copyright@minds.com. </Text>
    } else {
      return  <TextInput
                multiline = {true}
                numberOfLines = {4}
                placeholder={'Explain here why you report this'}
                returnKeyType={'done'}
                placeholderTextColor="gray"
                underlineColorAndroid='transparent'
                onChangeText={(value) => this.setState({ reason: value })}
                autoCapitalize={'none'}
                value={this.state.username}
              />
    }
  }

  submit() {
    reportService.report(this.props.entity.guid, this.state.value, this.state.reason).then((data) => {
        this.setState({success:true})
      })
      .catch(err => {
        console.log('error');
        throw "Ooops";
      });
  }

  showContent() {
    if(!!this.state.success) {
      return  <View style={[CommonStyle.flexContainer]}>
                <Text style={{ marginTop:30, marginBottom:30 }}> Thanks for letting us know! We appreciate your effort to keep Minds safe and secure. We will review your report as soon as possible. </Text>
                <TouchableHighlight
                  onPress={() => { this.props.close() }}
                  underlayColor = 'transparent'
                  style = {ComponentsStyle.bluebutton}
                >
                  <Text style={{color: colors.primary}} > Close </Text>
                </TouchableHighlight>
              </View>;
    } else {
      return  <View style={CommonStyle.flexContainer}>
                {this.showForm()}
                {this.showButton()}
              </View>
    }
  }

  render() {
    return (
      <ScrollView style={CommonStyle.flexContainer}>
        <View style={CommonStyle.flexContainer}>
          <Text style={{fontSize:20, alignSelf:'center'}}> Report </Text>
          {this.showContent()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex:1,
    paddingTop: 10,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
  },
  modalHeader: {
    padding: 5
  }
});
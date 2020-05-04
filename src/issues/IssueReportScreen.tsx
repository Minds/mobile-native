//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  Text,
  Alert,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';

import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle as CmpS } from '../styles/Components';
import { Version } from '../config/Version';
import Button from '../common/components/Button';
import gitlab from '../common/services/gitlab.service';

/**
 * Issue report screen
 */
export default class IssueReportScreen extends Component {
  static navigationOptions = {
    title: 'Bug report',
  };

  state = {
    titleRequired: false,
    descriptionRequired: false,
    stepsRequired: false,
    sending: false,
  };

  title = '';
  description = '';
  steps = '';

  /**
   * Get platform
   */
  getPlatform() {
    return `Running on ${Platform.OS.toUpperCase()} ${Platform.Version}`;
  }

  /**
   * Get app data
   */
  getApp() {
    return `App version: ${Version.VERSION} · build: ${Version.BUILD}`;
  }

  /**
   * Submit issue
   */
  onSubmit = async () => {
    const state = {
      titleRequired: false,
      descriptionRequired: false,
      stepsRequired: false,
    };

    if (!this.title) state.titleRequired = true;
    if (!this.description) state.descriptionRequired = true;
    if (!this.steps) state.stepsRequired = true;

    if (
      state.titleRequired ||
      state.descriptionRequired ||
      state.stepsRequired
    ) {
      this.setState(state);
    } else {
      const description = `### Summary:\n\n${
        this.description
      }\n\n### Steps to reproduce:\n\n${
        this.steps
      }\n\n### App version\n\n${this.getApp()}\n\n${this.getPlatform()}`;
      try {
        this.setState({ sending: true });
        const data = await gitlab.postIssue(this.title, description);
        Alert.alert(`Issue #${data.iid} submitted successfully.`);
        this.props.navigation.goBack();
      } catch (error) {
        Alert.alert(
          'Oops there was an error submiting the issue. Please try again.',
        );
      } finally {
        this.setState({ sending: false });
      }
    }
  };

  /**
   * Set field
   */
  setField = (field, value) => {
    this[field] = value;
    if (this.state[`${field}Required`] && value) {
      const state = {};
      state[`${field}Required`] = false;
      this.setState(state);
    }
  };

  /**
   * Render
   */
  render() {
    return (
      <ScrollView
        style={[CS.flexContainer, CS.padding2x, CS.backgroundLight]}
        keyboardShouldPersistTaps="always">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <Text style={CS.fontThin}>Title</Text>
          <TextInput
            style={CmpS.input}
            editable={true}
            underlineColorAndroid="transparent"
            placeholder="Title"
            onChangeText={(v) => this.setField('title', v)}
          />
          {this.state.titleRequired && (
            <Text style={[CS.colorDanger, CS.fontS, CS.fontThin]}>
              The title is required
            </Text>
          )}
          <Text style={[CS.marginTop2x, CS.fontThin]}>Description</Text>
          <TextInput
            style={[CmpS.input, CS.paddingTop2x, { minHeight: 100 }]}
            editable={true}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={5}
            placeholder="Description of the issue..."
            onChangeText={(v) => this.setField('description', v)}
          />
          {this.state.descriptionRequired && (
            <Text style={[CS.colorDanger, CS.fontS, CS.fontThin]}>
              The description is required
            </Text>
          )}
          <Text style={[CS.marginTop2x, CS.fontThin]}>Steps to reproduce</Text>
          <TextInput
            style={[CmpS.input, CS.paddingTop2x, { minHeight: 100 }]}
            editable={true}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={5}
            placeholder="Steps to reproduce..."
            onChangeText={(v) => this.setField('steps', v)}
          />
          {this.state.stepsRequired && (
            <Text style={[CS.colorDanger, CS.fontS, CS.fontThin]}>
              The steps are required
            </Text>
          )}
        </View>
        <View style={CS.paddingTop3x}>
          <Text style={[CS.fontM, CS.fontHairline]}>{this.getApp()}</Text>
        </View>
        <View style={CS.paddingTop1x}>
          <Text style={[CS.fontM, CS.fontThin]}>{this.getPlatform()}</Text>
        </View>
        <View style={CS.paddingTop3x}>
          <Text style={[CS.fontM, CS.fontThin]}>
            This bug report is anonymous
          </Text>
        </View>
        <View style={[CS.paddingTop2x, CS.centered]}>
          <Button
            text="Submit"
            textStyle={CS.fontXL}
            onPress={this.onSubmit}
            loading={this.state.sending}
            inverted
          />
        </View>
      </ScrollView>
    );
  }
}

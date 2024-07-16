//@ts-nocheck
import React, { Component } from 'react';

import { View, Alert, Platform, ScrollView } from 'react-native';

import { ComponentsStyle as CmpS } from '../styles/Components';
import { Version } from '../config/Version';
import Button from '../common/components/Button';
import gitlab from '../common/services/gitlab.service';

import TextInput from '../common/components/TextInput';
import MText from '../common/components/MText';

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
    const theme = sp.styles.style;
    return (
      <ScrollView
        style={[theme.flexContainer, theme.padding2x, theme.backgroundLight]}
        keyboardShouldPersistTaps="always">
        <View style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <MText style={theme.fontThin}>Title</MText>
          <TextInput
            style={CmpS.input}
            editable={true}
            underlineColorAndroid="transparent"
            placeholder="Title"
            onChangeText={v => this.setField('title', v)}
          />
          {this.state.titleRequired && (
            <MText style={[theme.colorDanger, theme.fontS, theme.fontThin]}>
              The title is required
            </MText>
          )}
          <MText style={[theme.marginTop2x, theme.fontThin]}>Description</MText>
          <TextInput
            style={[CmpS.input, theme.paddingTop2x, { minHeight: 100 }]}
            editable={true}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={5}
            placeholder="Description of the issue..."
            onChangeText={v => this.setField('description', v)}
          />
          {this.state.descriptionRequired && (
            <MText style={[theme.colorDanger, theme.fontS, theme.fontThin]}>
              The description is required
            </MText>
          )}
          <MText style={[theme.marginTop2x, theme.fontThin]}>
            Steps to reproduce
          </MText>
          <TextInput
            style={[CmpS.input, theme.paddingTop2x, { minHeight: 100 }]}
            editable={true}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={5}
            placeholder="Steps to reproduce..."
            onChangeText={v => this.setField('steps', v)}
          />
          {this.state.stepsRequired && (
            <MText style={[theme.colorDanger, theme.fontS, theme.fontThin]}>
              The steps are required
            </MText>
          )}
        </View>
        <View style={theme.paddingTop3x}>
          <MText style={[theme.fontM, theme.fontHairline]}>
            {this.getApp()}
          </MText>
        </View>
        <View style={theme.paddingTop1x}>
          <MText style={[theme.fontM, theme.fontThin]}>
            {this.getPlatform()}
          </MText>
        </View>
        <View style={theme.paddingTop3x}>
          <MText style={[theme.fontM, theme.fontThin]}>
            This bug report is anonymous
          </MText>
        </View>
        <View style={[theme.paddingTop2x, theme.centered]}>
          <Button
            text="Submit"
            textStyle={theme.fontXL}
            onPress={this.onSubmit}
            loading={this.state.sending}
            inverted
          />
        </View>
      </ScrollView>
    );
  }
}

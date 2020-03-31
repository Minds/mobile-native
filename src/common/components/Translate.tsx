import React, { PureComponent } from 'react';

import { Text, View, Alert, TextStyle } from 'react-native';

import * as entities from 'entities';
import { Icon } from 'react-native-elements';

import { CommonStyle } from '../../styles/Common';
import translationService from '../../common/services/translation.service';
import Tags from '../../common/components/Tags';
import ModalPicker from './ModalPicker';
import CenterLoading from '../../common/components/CenteredLoading';
import i18n from '../services/i18n.service';
import type ActivityModel from 'src/newsfeed/ActivityModel';

type PropsType = {
  entity: ActivityModel;
  style?: TextStyle | Array<TextStyle>;
};
/**
 * Translate component
 */
export default class Translate extends PureComponent<PropsType> {
  /**
   * Translate from
   */
  translatedFrom = null;
  /**
   * Selected Resolve
   */
  selectedResolve = null;

  state = {
    show: false,
    languages: null,
    translating: false,
    current: null,
    translated: false,
  };

  /**
   * Show language picker
   */
  showPicker = async () => {
    const languages = await translationService.getLanguages();

    const current =
      this.state.current || i18n.getCurrentLocale() || languages[0].language;

    this.setState({ languages, current });

    const selectPromise = new Promise((resolve, reject) => {
      this.selectedResolve = resolve;
    });

    return await selectPromise;
  };

  /**
   * Hide language picker
   */
  hidePicker = () => {
    this.setState({ languages: null });
  };

  /**
   * On language selected
   */
  languageSelected = (language) => {
    this.setState({ current: language }, async () => {
      this.hidePicker();
      await this.translate(language);
      this.selectedResolve(language);
    });
  };

  /**
   * Show translation
   */
  show = async () => {
    const lang = await translationService.getUserDefaultLanguage();

    this.setState({ show: true });

    if (!lang) {
      return await this.showPicker();
    } else {
      this.translate(lang);
      return lang;
    }
  };

  /**
   * Language selection canceled
   */
  cancel = () => {
    this.selectedResolve();
    this.hidePicker();
  };

  /**
   * Hide translation
   */
  hide = () => {
    this.setState({ translated: false, show: false });
  };

  /**
   * Get translated field
   * @param {string} field
   */
  getTranslated(field) {
    if (!this.state.translated || !this.state.translated[field]) return '';
    return this.state.translated[field].content;
  }

  /**
   * Render
   */
  render() {
    if (!this.state.show) return null;
    const picker = this.state.languages ? this.renderPicker() : null;
    const translated = this.renderTranslated();

    return (
      <View>
        {this.state.translating ? <CenterLoading /> : null}
        {picker}
        {translated}
      </View>
    );
  }

  /**
   * Translate
   * @param {string} language
   */
  async translate(language) {
    this.translatedFrom = null;
    this.setState({ translating: true });

    try {
      const translation = await translationService.translate(
        this.props.entity.guid,
        language,
      );
      for (let field in translation) {
        if (this.translatedFrom === null && translation[field].source) {
          this.translatedFrom = await translationService.getLanguageName(
            translation[field].source,
          );
        }
      }
      this.setState({ translated: translation, translating: false });
    } catch (e) {
      this.setState({ translating: false });
      this.showError();
    }
  }

  showError() {
    Alert.alert(
      i18n.t('ops'),
      i18n.t('translate.error') + '\n' + i18n.t('pleaseTryAgain'),
    );
  }

  /**
   * Render translated
   */
  renderTranslated() {
    if (!this.state.translated) {
      return null;
    }

    let message = entities
      .decodeHTML(this.getTranslated('message') || this.getTranslated('title'))
      .trim();
    let description = entities
      .decodeHTML(this.getTranslated('description'))
      .trim();
    let body = entities.decodeHTML(this.getTranslated('body')).trim();

    return (
      <View>
        <View
          style={[
            CommonStyle.paddingLeft2x,
            CommonStyle.marginTop2x,
            CommonStyle.borderLeft2x,
            CommonStyle.borderGreyed,
          ]}>
          {!!message && <Tags style={this.props.style}>{message}</Tags>}
          {!!description && <Tags style={this.props.style}>{description}</Tags>}
          {!!body && <Tags style={this.props.style}>{body}</Tags>}
        </View>
        <View
          style={[
            CommonStyle.rowJustifyStart,
            CommonStyle.alignCenter,
            CommonStyle.marginTop,
          ]}>
          <Icon
            name="md-globe"
            type="ionicon"
            size={14}
            iconStyle={{ marginTop: 2 }}
          />
          <Text style={[CommonStyle.paddingLeft, CommonStyle.colorDarkGreyed]}>
            {i18n.t('translate.from')}{' '}
            <Text style={CommonStyle.bold}>{this.translatedFrom}</Text>
          </Text>
        </View>
        <View
          style={[
            CommonStyle.rowJustifyStart,
            CommonStyle.alignCenter,
            CommonStyle.marginTop,
          ]}>
          <Text
            style={[CommonStyle.bold, CommonStyle.colorPrimary]}
            onPress={this.hide}>
            {i18n.t('hide')}
          </Text>
          <Text
            style={[
              CommonStyle.bold,
              CommonStyle.colorPrimary,
              CommonStyle.paddingLeft2x,
            ]}
            onPress={this.showPicker}>
            {i18n.t('translate.changeLanguage')}
          </Text>
        </View>
      </View>
    );
  }

  /**
   * Render languages picker
   */
  renderPicker() {
    return (
      <ModalPicker
        onSelect={this.languageSelected}
        onCancel={this.cancel}
        value={this.state.current}
        show={true}
        title="Select Language"
        valueField="language"
        labelField="name"
        items={this.state.languages}
      />
    );
  }
}

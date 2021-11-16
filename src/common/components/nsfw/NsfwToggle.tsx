//@ts-nocheck
import React, { Component } from 'react';
import autobind from '../../helpers/autobind';
import i18n from '../../services/i18n.service';
import CheckButton from '../bottom-sheet/CheckButton';
import SectionSubtitle from '../bottom-sheet/SectionSubtitle';
type PropsType = {
  value: Array<number>;
  onChange: (value: Array<number>) => void;
};
export default class NsfwToggle extends Component<PropsType> {
  constructor(props) {
    super(props);

    this.state = {
      active: Boolean(props.value && props.value.length),
    };

    this.reasons = [
      { value: 1, label: i18n.t('nsfw.1') },
      { value: 2, label: i18n.t('nsfw.2') },
      { value: 3, label: i18n.t('nsfw.3') },
      { value: 4, label: i18n.t('nsfw.4') },
      { value: 5, label: i18n.t('nsfw.5') },
      { value: 6, label: i18n.t('nsfw.6') },
    ];
  }

  @autobind
  toggle() {
    if (this.state.active) {
      this.props.onChange([]);
    }
    this.setState({ active: !this.state.active });
  }

  @autobind
  toggleDropdownOption(reason) {
    const activeReasonValues = [...(this.props.value || [])];
    const reasonIndex = activeReasonValues.indexOf(reason.value);

    if (reasonIndex > -1) {
      activeReasonValues.splice(reasonIndex, 1);
    } else {
      activeReasonValues.push(reason.value);
    }

    this.props.onChange(activeReasonValues);
  }

  isReasonActive(reason) {
    const activeReasonValues = this.props.value || [];
    return activeReasonValues.indexOf(reason.value) > -1;
  }

  render() {
    return (
      <React.Fragment>
        <SectionSubtitle>{i18n.t('nsfw.button')}</SectionSubtitle>
        <CheckButton
          onPress={this.toggle}
          selected={this.state.active}
          title={i18n.t('nsfw.showContent')}
        />
        {this.state.active &&
          this.reasons.map((reason, i) => (
            <CheckButton
              key={i}
              onPress={() => this.toggleDropdownOption(reason)}
              selected={this.isReasonActive(reason)}
              title={reason.label}
            />
          ))}
      </React.Fragment>
    );
  }
}

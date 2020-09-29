//@ts-nocheck
import React, { PureComponent } from 'react';
import { Picker, Platform, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Button from '../../common/components/Button';
import ThemedStyles from '../../styles/ThemedStyles';
import i18nService from '../services/i18n.service';

const height = Platform.OS === 'ios' ? 300 : 150;

interface ModalPickerProps {
  onSelect: (item: any) => any;
  onCancel: () => any;
  show?: boolean;
  title?: string;
  valueExtractor?: Function;
  keyExtractor?: Function;
  valueField?: string;
  labelField?: string;
  value?: string;
  items: any[];
}

/**
 * Modal picker component
 */
export default class ModalPicker extends PureComponent<ModalPickerProps> {
  state = {
    show: false,
    current: '',
    value: null,
  };

  /**
   * Derive state from props
   * @param {object} nextProps
   * @param {object} prevState
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      prevState.value !== nextProps.value &&
      prevState.current !== nextProps.value
    ) {
      return {
        current: nextProps.value,
        value: nextProps.value,
      };
    }

    return null;
  }

  componentWillUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  /**
   * Update state on select
   */
  select = (value) => {
    this.setState({ value });
  };

  /**
   * Show selection
   */
  ok = () => {
    if (this.props.onSelect) this.props.onSelect(this.state.value);
  };

  /**
   * Cancel
   */
  cancel = () => {
    this.setState({
      value: this.state.current,
    });
    if (this.props.onCancel) this.props.onCancel();
  };

  /**
   * Render
   */
  render() {
    const {
      title,
      labelField,
      valueField,
      items,
      props,
      valueExtractor,
      keyExtractor,
    } = this.props;

    if (!keyExtractor && !valueField) {
      throw new Error('Either keyExtractor or valueField must be provided');
    }

    const CS = ThemedStyles.style;

    return (
      <Modal isVisible={this.props.show}>
        <View style={[CS.backgroundTertiary, { height, paddingBottom: 8 }]}>
          <Text
            style={[
              CS.fontL,
              CS.textCenter,
              CS.padding2x,
              CS.colorPrimaryText,
              CS.backgroundTertiary,
            ]}>
            {title}
          </Text>
          <View style={[CS.flexContainer]}>
            <Picker
              {...props}
              onValueChange={this.select}
              selectedValue={this.state.value}
              style={CS.flexContainer}
              itemStyle={[
                CS.fontM,
                CS.colorPrimaryText,
                CS.backgroundTertiary,
              ]}>
              {items.map((item, i) => (
                <Picker.Item
                  key={i}
                  label={
                    valueExtractor ? valueExtractor(item) : item[labelField]
                  }
                  value={keyExtractor ? keyExtractor(item) : item[valueField]}
                  style={[CS.fontM, CS.colorPrimaryText, CS.backgroundTertiary]}
                />
              ))}
            </Picker>
            <View style={[CS.rowJustifySpaceEvenly]}>
              <Button text={i18nService.t('cancel')} onPress={this.cancel} />
              <Button text={i18nService.t('ok')} onPress={this.ok} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

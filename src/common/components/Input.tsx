//@ts-nocheck
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TextStyle,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import InfoPopup from './InfoPopup';

import ThemedStyles from '../../styles/ThemedStyles';
import PhoneValidationComponent from './phoneValidation/PhoneValidationComponent';

export interface PropsType {
  TFA?: any;
  TFAConfirmed?: boolean;
  inputType?: string;
  optional?: boolean;
  autofocus?: boolean;
  dateFormat?: string;
  labelStyle?: TextStyle | Array<TextStyle>;
  placeholder?: string;
  value?: string;
  testID?: string;
  keyboardType?: string;
  editable?: boolean;
  scrollEnabled?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  selectTextOnFocus?: boolean;
  onChangeText?: (string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onEndEditing?: () => void;
  onSubmitEditing?: () => void;
  style?: any;
  info?: string;
  error?: string;
}

/**
 * Form input
 */
export default class Input extends Component<PropsType> {
  /**
   * State
   */
  state = {
    datePickerVisible: false,
  };

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    if (this.inputRef.current && this.props.autofocus) {
      this.inputRef.current.focus();
    }
  }

  /**
   * Show date picker
   */
  showDatePicker = () => {
    this.setState({ datePickerVisible: true });
  };

  /**
   * Dismiss date picker
   */
  dismissDatePicker = () => {
    this.setState({ datePickerVisible: false });
  };

  /**
   * Confirm date picker
   */
  confirmDatePicker = (date) => {
    let dateString = '';
    switch (this.props.dateFormat) {
      case 'ISOString':
        dateString = date.toISOString().substring(0, 10);
        break;
      default:
        dateString = date.toLocaleDateString();
        break;
    }
    this.dismissDatePicker();
    this.props.onChangeText(dateString);
  };

  /**
   * Text input
   */
  textInput = () => {
    const theme = ThemedStyles.style;
    return (
      <TextInput
        {...this.props}
        style={[theme.input, this.props.style]}
        placeholderTextColor="#444"
        returnKeyType={'done'}
        autoCapitalize={'none'}
        underlineColorAndroid="transparent"
        ref={this.inputRef}
        placeholder=""
      />
    );
  };

  /**
   * Phone input
   */
  phoneInput = () => {
    const theme = ThemedStyles.style;
    return (
      <PhoneValidationComponent
        style={[theme.input, this.props.style]}
        textStyle={theme.colorPrimaryText}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        TFA={this.props.TFA}
        TFAConfirmed={this.props.TFAConfirmed}
      />
    );
  };

  /**
   * Date input
   */
  dateInput = () => {
    const theme = ThemedStyles.style;
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);
    return (
      <View>
        <TouchableOpacity
          {...this.props}
          style={[theme.input, this.props.style]}
          placeholderTextColor="#444"
          returnKeyType={'done'}
          autoCapitalize={'none'}
          underlineColorAndroid="transparent"
          placeholder=""
          onPress={this.showDatePicker}>
          <Text style={theme.colorPrimaryText}>{this.props.value}</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.datePickerVisible}
          onConfirm={this.confirmDatePicker}
          date={maxDate}
          maximumDate={maxDate}
          onCancel={this.dismissDatePicker}
          mode="date"
          display="spinner"
        />
      </View>
    );
  };

  /**
   * renders correct input
   */
  renderInput = () => {
    const inputType = this.props.inputType;
    if (inputType) {
      switch (inputType) {
        case 'textInput':
          return this.textInput();
        case 'phoneInput':
          return this.phoneInput();
        case 'dateInput':
          return this.dateInput();
      }
    }
    return this.textInput();
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const optional = this.props.optional ? (
      <Text style={[styles.optional, theme.colorSecondaryText]}>
        {'Optional'}
      </Text>
    ) : null;

    return (
      <View>
        <View style={styles.row}>
          <View style={styles.row}>
            <Text
              style={[
                styles.label,
                theme.colorSecondaryText,
                this.props.labelStyle,
              ]}>
              {this.props.placeholder}
            </Text>
            {this.props.info && <InfoPopup info={this.props.info} />}
            {!!this.props.error && (
              <View style={styles.errorContainer}>
                <Text style={[theme.colorAlert, theme.fontL, theme.textRight]}>
                  {this.props.error}
                </Text>
              </View>
            )}
          </View>
          {optional}
        </View>
        {this.renderInput()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  errorContainer: {
    alignContent: 'flex-end',
    flexGrow: 1,
    paddingRight: 10,
  },
  optional: {
    fontSize: 14,
    fontFamily: 'Roboto-Italic',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});

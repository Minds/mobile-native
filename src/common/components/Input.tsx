//@ts-nocheck
import React, { Component } from 'react';
import { View, StyleSheet, TextStyle, TextInputProps } from 'react-native';
import InfoPopup from './InfoPopup';

import ThemedStyles from '../../styles/ThemedStyles';
import TextInput from './TextInput';
import MText from './MText';
import DatePicker from './controls/DatePicker';
import ErrorBoundary from './ErrorBoundary';

export interface PropsType extends TextInputProps {
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
  timeoutCleanup = null;

  /**
   * Constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.shouldAutofocus();
  }

  shouldAutofocus() {
    this.timeoutCleanup = setTimeout(() => {
      if (this.inputRef.current && this.props.autofocus) {
        this.inputRef.current.focus();
      }
    }, 300);
  }

  componentWillUnmount() {
    if (this.timeoutCleanup) {
      clearTimeout(this.timeoutCleanup);
    }
  }

  /**
   * Confirm date picker
   */
  confirmDatePicker = date => {
    let dateString = '';
    switch (this.props.dateFormat) {
      case 'ISOString':
        dateString = date.toISOString().substring(0, 10);
        break;
      default:
        dateString = date.toLocaleDateString();
        break;
    }
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
        returnKeyType={this.props.returnKeyType || 'done'}
        autoCapitalize={'none'}
        underlineColorAndroid="transparent"
        ref={this.inputRef}
        placeholder=""
      />
    );
  };

  /**
   * Date input
   */
  dateInput = () => {
    return (
      <DatePicker
        hideTitle
        spacing="S"
        noHorizontal
        date={this.props.value}
        onConfirm={d => this.confirmDatePicker(d)}
        maximumDate={this.props.maximumDate}
        minimumDate={this.props.minimumDate}
      />
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
      <MText style={[styles.optional, theme.colorSecondaryText]}>
        {'Optional'}
      </MText>
    ) : null;

    return (
      <ErrorBoundary>
        <View style={styles.container}>
          <View>
            <View style={theme.rowStretch}>
              <MText
                style={[
                  styles.label,
                  theme.colorSecondaryText,
                  this.props.labelStyle,
                ]}>
                {this.props.placeholder}
              </MText>
              {this.props.info && <InfoPopup info={this.props.info} />}
              {!!this.props.error && (
                <View style={styles.errorContainer}>
                  <MText
                    style={[theme.colorAlert, theme.fontL, theme.textRight]}>
                    {this.props.error}
                  </MText>
                </View>
              )}
            </View>
            {optional}
          </View>
          {this.renderInput()}
        </View>
      </ErrorBoundary>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 0,
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

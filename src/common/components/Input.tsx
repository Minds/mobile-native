//@ts-nocheck
import React, { Component } from 'react';
import { View, TextStyle, TextInputProps } from 'react-native';
import InfoPopup from './InfoPopup';

import ThemedStyles from '../../styles/ThemedStyles';
import TextInput from './TextInput';
import MText from './MText';
import ErrorBoundary from './ErrorBoundary';
import DatePickerInput from './controls/DatePickerInput';

export interface PropsType extends TextInputProps {
  TFA?: any;
  TFAConfirmed?: boolean;
  inputType?: string;
  optional?: boolean;
  autofocus?: boolean;
  dateFormat?: string;
  labelStyle?: TextStyle | Array<TextStyle>;
  /**
   * the label for the input
   */
  placeholder?: string;
  /**
   * the placeholder text for the TextInput
   */
  placeholderText?: string;
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
  hint?: string;
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

  focus() {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  componentWillUnmount() {
    if (this.timeoutCleanup) {
      clearTimeout(this.timeoutCleanup);
    }
  }

  /**
   * Confirm date picker
   */
  confirmDatePicker = (date: Date) => {
    let dateString = '';
    if (date) {
      switch (this.props.dateFormat) {
        case 'ISOString':
          dateString = date.toISOString().substring(0, 10);
          break;
        default:
          dateString = date.toLocaleDateString();
          break;
      }
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
        placeholderTextColor={theme.colorTertiaryText.color}
        returnKeyType={this.props.returnKeyType || 'done'}
        autoCapitalize={'none'}
        underlineColorAndroid="transparent"
        onChangeText={
          this.props.inputType === 'number'
            ? value => this.props.onChangeText(value.replace(/[^0-9]/g, ''))
            : this.props.onChangeText
        }
        ref={this.inputRef}
        placeholder={this.props.placeholderText}
      />
    );
  };

  /**
   * Date input
   */
  dateInput = () => {
    return (
      <DatePickerInput
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
              {!!this.props.hint && !this.props.error && (
                <View style={theme.flexContainer}>
                  <MText style={styles.hintStyles} align="right">
                    {this.props.hint}
                  </MText>
                </View>
              )}
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

const styles = ThemedStyles.create({
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
    fontFamily: 'Roboto_400Regular',
  },
  errorContainer: {
    alignContent: 'flex-end',
    flexGrow: 1,
  },
  optional: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular_Italic',
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
  hintStyles: [
    { lineHeight: 18, fontSize: 16 },
    'fontL',
    'colorSecondaryText',
    'textRight',
  ],
});

// import React, { useState } from 'react';
// import { Icon, Input, Text } from 'components/.';
// import { Controller } from 'react-hook-form';
// import { globalStyles } from 'styles/.';
// import { FormInputType } from 'components/global.types';
// import { useTranslation } from 'containers/main/locales';
// import { ImageProps, TouchableWithoutFeedback } from 'react-native';

// interface InputPasscodeType extends FormInputType<{ passcode?: string }> {
//   passcode?: string;
// }

// export function InputPasscode(props: InputPasscodeType): JSX.Element {
//   const { t } = useTranslation();
//   const { isVisible } = useVisibilityIcon();
//   const { passcode = '', control, errors, theRef, onSubmitEditing } = props;

//   return (
//     <Controller
//       control={control}
//       defaultValue={passcode}
//       name="passcode"
//       rules={{
//         required: { value: true, message: t('Passcode is required') },
//         pattern: {
//           value: /^\d{6}$/i,
//           message: t('Passcode must have exactly 6 digits'),
//         },
//       }}
//       render={({ onChange, onBlur, value }) => (
//         <>
//           <Input
//             ref={theRef}
//             size="large"
//             status="basic"
//             style={globalStyles.marginTopBase}
//             placeholder={t('Please enter')}
//             returnKeyType={'next'}
//             label={t('Passcode')}
//             testID={'input-passcode-field'}
//             secureTextEntry={!isVisible}
//             autoFocus={false}
//             autoCorrect={false}
//             keyboardType={'number-pad'}
//             maxLength={6}
//             value={value}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             onSubmitEditing={onSubmitEditing}
//           />
//           <Text
//             testID={'text-passcode-error'}
//             category={'label'}
//             status={'danger'}>
//             {errors.passcode?.message}
//           </Text>
//         </>
//       )}
//     />
//   );
// }

// type VisibleField = {
//   isVisible: boolean;
//   renderEyeIcon: (props?: Partial<ImageProps>) => React.ReactElement;
// };

// function useVisibilityIcon(): VisibleField {
//   const [isVisible, setisVisible] = useState<boolean>(false);

//   const renderEyeIcon = (props?: Partial<ImageProps>): React.ReactElement => (
//     <TouchableWithoutFeedback onPress={() => setisVisible(value => !value)}>
//       <Icon {...props} name={isVisible ? 'eye' : 'eye-off'} />
//     </TouchableWithoutFeedback>
//   );

//   return {
//     isVisible,
//     renderEyeIcon,
//   };
// }
export {};

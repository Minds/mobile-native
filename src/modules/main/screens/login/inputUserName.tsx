// import React from 'react'
// import { Input, Text } from 'components/.'
// import { Controller } from 'react-hook-form'
// import { globalStyles } from 'styles/.'
// import { FormInputType } from 'components/global.types'
// import { useTranslation } from 'containers/main/locales'

// interface InputUsernameType extends FormInputType<{ username?: string }> {
//   username?: string
// }

// export function InputUsername(props: InputUsernameType): JSX.Element {
//   const { t } = useTranslation()
//   const { username = '', control, errors, theRef, nextRef, onSubmitEditing } = props

//   const onSubmit = onSubmitEditing ? onSubmitEditing : () => nextRef?.current?.focus()

//   return (
//     <Controller
//       control={control}
//       defaultValue={username}
//       name='username'
//       rules={{
//         required: { value: true, message: t('This field is required') },
//         minLength: {
//           value: 4,
//           message: t('Username must have at least 4 characters'),
//         },
//       }}
//       render={({ onChange, onBlur, value }) => (
//         <>
//           <Input
//             size='large'
//             status='basic'
//             ref={theRef}
//             style={globalStyles.marginTopBase}
//             label={t('Username')}
//             testID='input-name-field'
//             placeholder={t('Please enter')}
//             returnKeyType={'next'}
//             autoFocus
//             autoCapitalize={'none'}
//             autoCorrect={false}
//             value={value}
//             onBlur={onBlur}
//             onChangeText={onChange}
//             onSubmitEditing={onSubmit}
//           />
//           <Text category={'label'} status={'danger'}>
//             {errors.username?.message}
//           </Text>
//         </>
//       )}
//     />
//   )
// }
export {};

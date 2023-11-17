import React from 'react';
import { observer } from 'mobx-react';
import { Keyboard, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import MdIcon from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import i18n from '~/common/services/i18n.service';
import ThemedStyles, { useStyle } from '~/styles/ThemedStyles';
import MText from '../MText';
import { BottomSheetButton, BottomSheetModal } from '../bottom-sheet';

export type BaseFeedFilterPropsType = {
  hideLabel?: boolean;
  label?: string;
  title?: string;
  children: React.ReactNode;
  containerStyles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

/**
 * Base Feed Filter component
 */
const BaseFeedFilter = (props: BaseFeedFilterPropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    Keyboard.dismiss();
    ref.current?.present();
  }, [ref]);

  const containerStyle = useStyle(
    'rowJustifyEnd',
    props.containerStyles as ViewStyle,
  );
  const textStyle = useStyle(
    'paddingLeft',
    { fontSize: 15 },
    props.textStyle as ViewStyle,
  );

  return (
    <>
      <TouchableOpacity
        style={containerStyle}
        onPress={show}
        testID="FilterToggle">
        <MdIcon
          name="filter-variant"
          size={18}
          style={ThemedStyles.style.colorIcon}
        />
        {!props.hideLabel && (
          <MText style={textStyle}>{props.label || i18n.t('filter')}</MText>
        )}
      </TouchableOpacity>
      <BottomSheetModal ref={ref} title={props.title}>
        <BottomSheetScrollView>
          {props.children}
          <BottomSheetButton text={i18n.t('close')} onPress={close} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
};

export default observer(BaseFeedFilter);

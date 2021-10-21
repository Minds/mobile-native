import React from 'react';
import { Keyboard, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import i18n from '../services/i18n.service';
import { useStyle } from '../../styles/ThemedStyles';
import MdIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { observer } from 'mobx-react';
import BottomSheet from './bottom-sheet/BottomSheet';
import BottomSheetButton from './bottom-sheet/BottomSheetButton';
import RadioButton from './bottom-sheet/RadioButton';
import MText from './MText';

type PropsType = {
  hideLabel?: boolean;
  store: {
    filter: string;
    setFilter: Function;
  };
  containerStyles?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

/**
 * Feed Filter selector
 */
const FeedFilter = (props: PropsType) => {
  const ref = React.useRef<any>();
  const close = React.useCallback(() => {
    ref.current?.dismiss();
  }, [ref]);
  const show = React.useCallback(() => {
    Keyboard.dismiss();
    ref.current?.present();
  }, [ref]);
  const iconStyle = useStyle('colorIcon');

  const options = React.useMemo(
    () =>
      ['all', 'images', 'videos', 'blogs'].map(f => ({
        title: i18n.t(`discovery.${f}`),
        onPress: () => {
          close();
          setTimeout(() => {
            if (props.store && props.store.setFilter) {
              props.store.setFilter(f);
            }
          }, 200);
        },
        selected: props.store.filter === f,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [close, props.store, props.store.filter],
  );

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
        <MdIcon name="filter-variant" size={18} style={iconStyle} />
        {!props.hideLabel && (
          <MText style={textStyle}>{i18n.t('filter')}</MText>
        )}
      </TouchableOpacity>
      <BottomSheet ref={ref} title={i18n.t('filter') + ' ' + i18n.t('feed')}>
        {options.map((b, i) => (
          <RadioButton {...b} key={i} />
        ))}
        <BottomSheetButton text={i18n.t('close')} onPress={close} />
      </BottomSheet>
    </>
  );
};

export default observer(FeedFilter);

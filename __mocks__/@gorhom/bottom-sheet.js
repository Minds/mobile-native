//__mocks__/@gorhom/bottom-sheet.tsx
import React from 'react';
import { View, ScrollView, Modal, FlatList } from 'react-native';

const BottomSheetModalContext = React.createContext(null);

const BottomSheetModalProvider = (props: any) => {
  return <BottomSheetModalContext.Provider {...props} value={{}} />;
};
const BottomSheet = (props: any) => <View {...props} />;
const BottomSheetModal = (props: any) => <Modal {...props} />;

const BottomSheetBackdrop = (props: any) => <View {...props} />;
const BottomSheetHandle = (props: any) => <View {...props} />;
const BottomSheetFooter = (props: any) => <View {...props} />;
const BottomSheetScrollView = (props: any) => <ScrollView {...props} />;
const BottomSheetFlatList = (props: any) => <FlatList {...props} />;

const useBottomSheet = jest.fn();
const useBottomSheetModal = jest.fn();
const useBottomSheetSpringConfigs = jest.fn();
const useBottomSheetTimingConfigs = jest.fn();
const useBottomSheetInternal = jest.fn();
const useBottomSheetDynamicSnapPoints = jest.fn(x => ({
  animatedHandleHeight: null,
  animatedSnapPoints: null,
  animatedContentHeight: null,
  handleContentLayout: null,
}));

const TouchableOpacity = View;

export { useBottomSheet };
export { useBottomSheetModal };
export { useBottomSheetSpringConfigs };
export { useBottomSheetTimingConfigs };
export { useBottomSheetInternal };
export { useBottomSheetDynamicSnapPoints };

export {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetFlatList,
  TouchableOpacity,
};

export default BottomSheet;

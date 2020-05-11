import React, { useRef, useEffect } from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import ThemedStyles from '../../styles/ThemedStyles';
import { StyleSheet, View, Text } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';

type PropsType = {
  onCancel: () => void;
  onDone?: () => void;
  title: string;
  show?: boolean;
  doneText: string;
  height: number;
  content: React.ReactNode;
};

/**
 * Bottom options popup
 * @example
 * <BottomOptionPopup
 *   height={500}
 *   title="Some title"
 *   show={true}
 *   onCancel={() => console.log('canceled')}
 *   onDone={() => console.log('done')}
 *   content={body}
 *   doneText="Done"
 * />
 */
const BottomOptionPopup = observer((props: PropsType) => {
  const theme = ThemedStyles.style;
  const ref = useRef<BottomSheet>(null);

  const store = useLocalStore(
    (p) => ({
      showing: false,
      close() {
        store.showing = false;
        ref.current?.snapTo(0);
        ref.current?.snapTo(0);
      },
      cancel() {
        store.close();
        p.onCancel();
      },
      open() {
        store.showing = true;
        ref.current?.snapTo(1);
        ref.current?.snapTo(1);
      },
      done() {
        if (p.onDone) {
          p.onDone();
        }
      },
    }),
    props,
  );

  useEffect(() => {
    if (props.show) {
      // called twice as a workaround
      store.open();
    } else {
      // called twice as a workaround
      store.close();
    }
  }, [store, props.show]);

  return (
    <>
      {store.showing && (
        <View style={[styles.overlay, theme.backgroundSecondary]} />
      )}
      <BottomSheet
        ref={ref}
        snapPoints={[0, props.height]}
        onCloseEnd={store.cancel}
        renderHeader={() =>
          store.showing ? (
            <View style={styles.headerContainer}>
              <View
                style={[
                  theme.backgroundSecondary,
                  theme.rowJustifySpaceBetween,
                  theme.alignEnd,
                  styles.header,
                ]}>
                <Text
                  onPress={store.close}
                  style={[
                    theme.fontXL,
                    theme.fontMedium,
                    theme.colorSecondaryText,
                  ]}>
                  Cancel
                </Text>
                <Text
                  style={[theme.fontXL, theme.fontMedium, theme.textCenter]}>
                  {props.title}
                </Text>
                <Text
                  style={[theme.fontXL, theme.fontMedium, theme.colorLink]}
                  onPress={store.done}>
                  {props.doneText}
                </Text>
              </View>
            </View>
          ) : null
        }
        renderContent={() =>
          store.showing ? (
            <View style={[styles.panel, theme.backgroundSecondary]}>
              {props.content}
            </View>
          ) : null
        }
        initialSnap={0}
        enabledContentTapInteraction={true}
        enabledInnerScrolling={true}
      />
    </>
  );
});

export default BottomOptionPopup;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  headerContainer: {
    overflow: 'hidden',
    paddingTop: 20,
  },
  header: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 8,
    padding: 20,
  },
  panel: {
    height: '100%',
  },
});

const createStore = () => ({
  visible: false,
  onPressDone: undefined as Function | undefined,
  content: undefined as React.ReactNode,
  title: '',
  doneText: '',
  show(title: string, done: string, content: React.ReactNode) {
    this.content = content;
    this.title = title;
    this.doneText = done;
    this.visible = true;
  },
  setOnPressDone(onDone) {
    this.onPressDone = onDone;
  },
  hide() {
    this.content = undefined;
    this.onPressDone = undefined;
    this.visible = false;
  },
});

export type BottomOptionsStoreType = ReturnType<typeof createStore>;

export const useBottomOption = () => {
  return useLocalStore(createStore);
};

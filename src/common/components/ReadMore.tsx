import { useLayout } from '@react-native-community/hooks';
import React, { useReducer } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const VIEW_MORE_HEIGHT = 33;

function reducer(state, action) {
  switch (action.type) {
    case 'measured':
      return {
        ...state,
        measured: true,
        fullHeight: action.fullHeight,
      };
    case 'limitedHeight':
      return {
        ...state,
        measured: true,
        limitedHeight: action.limitedHeight,
        shouldShowReadMore:
          state.fullHeight > action.limitedHeight && action.limitedHeight,
      };
    case 'showAll':
      return {
        ...state,
        showAllText: true,
      };
    case 'showLess':
      return {
        ...state,
        showAllText: false,
      };
    default:
      throw new Error('Wrong action');
  }
}

const initialState = {
  measured: false,
  shouldShowReadMore: false,
  showAllText: false,
  fullHeight: 0,
  limitedHeight: 0,
};

export default function ReadMore(props) {
  const { numberOfLines } = props;
  const { onLayout, ...layout } = useLayout();
  const [state, dispatch] = useReducer(reducer, initialState);

  if (
    layout.height &&
    state.measured &&
    !state.limitedHeight &&
    layout.height < state.fullHeight
  ) {
    dispatch({ type: 'limitedHeight', limitedHeight: layout.height });
  }

  if (layout.height && !state.measured) {
    dispatch({ type: 'measured', fullHeight: layout.height });
  }

  const handlePressReadMore = () => {
    dispatch({ type: 'showAll' });
  };

  const handlePressReadLess = () => {
    dispatch({ type: 'showLess' });
  };

  return (
    <View
      style={{
        height:
          state.limitedHeight && !state.showAllText
            ? state.limitedHeight + VIEW_MORE_HEIGHT
            : state.fullHeight + VIEW_MORE_HEIGHT,
      }}
      collapsable={false}>
      <Text
        numberOfLines={
          state.measured && !state.showAllText ? numberOfLines : undefined
        }
        onLayout={onLayout}>
        {props.children}
      </Text>
      {state.shouldShowReadMore && (
        <View style={styles.readMore}>
          {state.shouldShowReadMore && !state.showAllText ? (
            props.renderTruncatedFooter ? (
              props.renderTruncatedFooter(handlePressReadMore)
            ) : (
              <Text style={styles.button} onPress={handlePressReadMore}>
                Read more
              </Text>
            )
          ) : (
            state.shouldShowReadMore &&
            state.showAllText &&
            (props.renderRevealedFooter ? (
              props.renderRevealedFooter(handlePressReadLess)
            ) : (
              <Text style={styles.button} onPress={handlePressReadLess}>
                Hide
              </Text>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: 5,
  },
  readMore: {
    height: VIEW_MORE_HEIGHT,
  },
});

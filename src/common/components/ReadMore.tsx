import React from 'react';
import { Platform, StyleSheet, Text, TextStyle, View } from 'react-native';
import Tags from './Tags';
const VIEW_MORE_HEIGHT = 33;

// we add an extra line for ios, because the onTextLayout event doesn't clip the last line
const additional = Platform.OS === 'ios' ? 1 : 0;

const MoreLessComponent = ({
  truncatedText,
  fullText,
  style,
  navigation,
  renderTruncatedFooter,
  renderRevealedFooter,
}) => {
  const [more, setMore] = React.useState(false);
  const handlePressReadMore = React.useCallback(() => setMore(true), []);
  const handlePressReadLess = React.useCallback(() => setMore(false), []);
  return (
    <View>
      <Text>
        <Tags navigation={navigation} style={style} selectable={true}>
          {!more ? `${truncatedText}...` : fullText}
        </Tags>
      </Text>
      <View style={styles.readMore}>
        {!more ? (
          renderTruncatedFooter ? (
            renderTruncatedFooter(handlePressReadMore)
          ) : (
            <Text style={styles.button} onPress={handlePressReadMore}>
              Read more
            </Text>
          )
        ) : renderRevealedFooter ? (
          renderRevealedFooter(handlePressReadLess)
        ) : (
          <Text style={styles.button} onPress={handlePressReadLess}>
            Hide
          </Text>
        )}
      </View>
    </View>
  );
};

type PropsType = {
  numberOfLines: number;
  text: string;
  style?: TextStyle | Array<TextStyle>;
  navigation: any;
  renderTruncatedFooter?: React.ReactNode;
  renderRevealedFooter?: React.ReactNode;
};

export default function ReadMore({
  numberOfLines,
  text,
  style,
  navigation,
  renderTruncatedFooter,
  renderRevealedFooter,
}: PropsType) {
  const [clippedText, setClippedText] = React.useState('');
  return clippedText ? (
    <MoreLessComponent
      truncatedText={clippedText}
      fullText={text}
      style={style}
      navigation={navigation}
      renderTruncatedFooter={renderTruncatedFooter}
      renderRevealedFooter={renderRevealedFooter}
    />
  ) : (
    <View>
      <Text
        numberOfLines={numberOfLines + additional}
        ellipsizeMode={'tail'}
        style={style}
        onTextLayout={event => {
          const { lines } = event.nativeEvent;

          let linesText = lines
            .splice(0, numberOfLines)
            .map(line => line.text)
            .join('');

          setClippedText(text.substr(0, linesText.length - 9));
        }}>
        <Tags navigation={navigation} style={style} selectable={true}>
          {text}
        </Tags>
      </Text>
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

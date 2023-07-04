import React from 'react';
import { Platform, StyleSheet, TextStyle, View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';
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
      <MText>
        <Tags navigation={navigation} style={style} selectable={true}>
          {!more ? `${truncatedText}...` : fullText}
        </Tags>
      </MText>
      <View style={styles.readMore}>
        {!more ? (
          renderTruncatedFooter ? (
            renderTruncatedFooter(handlePressReadMore)
          ) : (
            <MText style={buttonStyle} onPress={handlePressReadMore}>
              Read more
            </MText>
          )
        ) : renderRevealedFooter ? (
          renderRevealedFooter(handlePressReadLess)
        ) : (
          <MText style={buttonStyle} onPress={handlePressReadLess}>
            Hide
          </MText>
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
  renderTruncatedFooter?: React.ReactNode | ((any) => React.ReactNode);
  renderRevealedFooter?: React.ReactNode | ((any) => React.ReactNode);
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
  const onTextLayout = React.useCallback(
    event => {
      const { lines } = event.nativeEvent;

      if (lines.length <= numberOfLines) {
        return;
      }

      let linesText = lines
        .splice(0, numberOfLines)
        .map(line => line.text)
        .join('');

      setClippedText(text.substr(0, linesText.length - 9));
    },
    [numberOfLines, text],
  );

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
      <MText
        numberOfLines={numberOfLines + additional}
        ellipsizeMode={'tail'}
        style={style}
        onTextLayout={onTextLayout}>
        <Tags navigation={navigation} style={style} selectable={true}>
          {text}
        </Tags>
      </MText>
    </View>
  );
}

const styles = StyleSheet.create({
  readMore: {
    height: VIEW_MORE_HEIGHT,
  },
});

const buttonStyle = ThemedStyles.combine('paddingTop2x', 'colorLink');

import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { StyleSheet, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MText from '../../../common/components/MText';

export type AccordionContentData = {
  title: string;
  info: string;
  tooltip?: {
    title: string;
    width: number;
    height: number;
  };
};

type PropsType = {
  data: AccordionContentData[];
  summary?: React.ReactElement;
};

export const Container = ({ style = {}, children }) => {
  const theme = ThemedStyles.style;
  const paddingPointsView = [
    theme.rowJustifyStart,
    theme.paddingLeft5x,
    theme.paddingTop3x,
    style,
  ];
  return <View style={paddingPointsView}>{children}</View>;
};

export const Row = ({ style = {}, children }) => {
  const theme = ThemedStyles.style;
  const rowView = [theme.rowStretch, theme.flexContainer, style];
  return <View style={rowView}>{children}</View>;
};

export const Title = ({ style = {}, children }) => {
  const theme = ThemedStyles.style;
  const titleStyle = [
    theme.colorSecondaryText,
    theme.fontNormal,
    theme.fontL,
    style,
  ];
  return <MText style={titleStyle}>{children}</MText>;
};

export const Info = ({ style = {}, children }) => {
  const theme = ThemedStyles.style;
  const infoStyle = [theme.fontMedium, theme.alignSelfEnd, theme.fontL, style];
  return <MText style={infoStyle}>{children}</MText>;
};

const AccordionContent = ({ data, summary }: PropsType) => {
  const theme = ThemedStyles.style;

  return (
    <View
      style={[
        theme.bgSecondaryBackground,
        theme.marginTop,
        theme.paddingBottom5x,
        theme.bcolorPrimaryBorder,
      ]}
    >
      {data.map(row => {
        return (
          <Container>
            <Row>
              <Title>{row.title}</Title>
              {row.tooltip && (
                <View style={styles.tooltipContainer}>
                  <Tooltip
                    skipAndroidStatusBar={true}
                    withOverlay={false}
                    containerStyle={theme.borderRadius}
                    width={row.tooltip.width}
                    height={row.tooltip.height}
                    backgroundColor={ThemedStyles.getColor('Link')}
                    popover={
                      <MText style={theme.colorWhite}>
                        {row.tooltip.title}
                      </MText>
                    }
                  >
                    <Icon
                      name="information-variant"
                      size={15}
                      color="#AEB0B8"
                    />
                  </Tooltip>
                </View>
              )}
            </Row>
            <Row style={theme.paddingRight5x}>
              <Info>{row.info}</Info>
            </Row>
          </Container>
        );
      })}
      {summary && (
        <MText
          style={[
            theme.fontLM,
            theme.fontMedium,
            theme.marginLeft5x,
            theme.paddingTop3x,
            theme.bcolorPrimaryBorder,
            theme.borderTop,
            theme.marginTop7x,
            theme.width80,
          ]}
        >
          Summary
        </MText>
      )}
      {summary && summary}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    paddingLeft: 10,
    paddingBottom: 2,
    alignSelf: 'flex-end',
  },
});

export default AccordionContent;

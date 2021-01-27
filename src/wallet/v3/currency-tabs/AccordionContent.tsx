import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import { StyleSheet, Text, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type AccordionContentData = {
  title: string;
  info: string;
  tooltip?: {
    title: string;
    width: number;
    height: number;
  };
};

type AccordionContentSummary = {
  concept: string;
  count: number;
  points: number;
};

type PropsType = {
  data: AccordionContentData[];
  sumary: AccordionContentSummary[];
};

const AccordionContent = () => {
  const theme = ThemedStyles.style;

  const data: AccordionContentData[] = [
    {
      title: 'Your Score',
      info: '200 points',
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
    },
    {
      title: 'Total network score',
      info: '40000 points',
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
    },
    {
      title: 'Your percentage',
      info: '0.5%',
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
    },
    {
      title: 'Cash reward',
      info: '$0.35 (0.5% of $5)',
      tooltip: {
        title: 'Minds Pro earnings Minds Pro earnings Minds Pro earnings',
        width: 200,
        height: 80,
      },
    },
  ];

  const summary: AccordionContentSummary[] = [
    {
      concept: 'Comments',
      count: 1,
      points: 10,
    },
    {
      concept: 'Page Views',
      count: 100,
      points: 30,
    },
    {
      concept: 'Check-ins',
      count: 3,
      points: 20,
    },
  ];

  let totalSummaryPoints = 0;

  const titleStyle = [theme.colorSecondaryText, theme.fontNormal, theme.fontL];
  const infoStyle = [theme.fontMedium, theme.alignSelfEnd, theme.fontL];
  const paddingPointsView = [
    theme.rowJustifyStart,
    theme.paddingLeft4x,
    theme.paddingTop5x,
  ];

  return (
    <View
      style={[
        theme.backgroundSecondary,
        theme.marginTop,
        theme.paddingBottom5x,
        theme.borderPrimary,
        theme.borderTop,
        theme.borderBottom,
      ]}>
      {data.map((row) => {
        return (
          <View style={paddingPointsView}>
            <View style={[theme.rowStretch, theme.flexContainer]}>
              <Text style={titleStyle}>{row.title}</Text>
              {row.tooltip && (
                <View style={styles.tooltipContainer}>
                  <Tooltip
                    skipAndroidStatusBar={true}
                    withOverlay={false}
                    containerStyle={theme.borderRadius}
                    width={row.tooltip.width}
                    height={row.tooltip.height}
                    backgroundColor={ThemedStyles.getColor('link')}
                    popover={
                      <Text style={theme.colorWhite}>{row.tooltip.title}</Text>
                    }>
                    <Icon
                      name="information-variant"
                      size={15}
                      color="#AEB0B8"
                    />
                  </Tooltip>
                </View>
              )}
            </View>
            <View style={[theme.rowStretch, theme.flexContainer]}>
              <Text style={infoStyle}>{row.info}</Text>
            </View>
          </View>
        );
      })}
      <Text
        style={[
          theme.fontLM,
          theme.fontMedium,
          theme.marginLeft4x,
          theme.paddingTop3x,
          theme.borderPrimary,
          theme.borderTop,
          theme.marginTop7x,
          theme.width80,
        ]}>
        Summary
      </Text>
      {summary.map((row) => {
        totalSummaryPoints += row.points;
        return (
          <View style={paddingPointsView}>
            <View
              style={[
                theme.rowJustifySpaceBetween,
                theme.flexContainer,
                theme.marginRight6x,
              ]}>
              <Text style={titleStyle}>{row.concept}</Text>
              <Text style={titleStyle}>{row.count}</Text>
            </View>
            <View style={[theme.rowStretch, theme.flexContainer]}>
              <Text style={[...infoStyle, theme.bold]}>
                {row.points}{' '}
                <Text style={[theme.colorSecondaryText]}>points</Text>
              </Text>
            </View>
          </View>
        );
      })}
      <View style={paddingPointsView}>
        <View style={[theme.rowJustifySpaceBetween, theme.flexContainer]}>
          <Text style={titleStyle}>Total Points</Text>
          <Text style={infoStyle}>{totalSummaryPoints} </Text>
        </View>
        <View style={theme.flexContainer}>
          <Text style={titleStyle}>points</Text>
        </View>
      </View>
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

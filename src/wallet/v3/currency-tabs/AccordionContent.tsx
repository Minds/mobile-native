import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Tooltip } from 'react-native-elements';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import MText from '../../../common/components/MText';
import { B2, B1, Row as LayoutRow } from '~ui';
import sp from '~/services/serviceProvider';

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
  const theme = sp.styles.style;
  const paddingPointsView = [
    theme.rowJustifyStart,
    theme.paddingLeft4x,
    theme.paddingRight5x,
    theme.paddingVertical1x,
    style,
  ];
  return <View style={paddingPointsView}>{children}</View>;
};

export const Row = ({ children }) => {
  return <LayoutRow align="centerStart">{children}</LayoutRow>;
};

export const RowRight = ({ children }) => {
  return (
    <LayoutRow align="centerStart" flex left="XXL">
      {children}
    </LayoutRow>
  );
};

export const Title = ({ children }) => {
  return <B2 color="secondary">{children}</B2>;
};

export const Info = ({ children }) => {
  return (
    <LayoutRow flex align="centerEnd">
      <B2 font="medium">{children}</B2>
    </LayoutRow>
  );
};

const AccordionContent = ({ data, summary }: PropsType) => {
  const theme = sp.styles.style;

  return (
    <View
      style={[
        theme.bgSecondaryBackground,
        theme.marginTop,
        theme.paddingBottom5x,
        theme.bcolorPrimaryBorder,
      ]}>
      {data.map((row, index) => {
        return (
          <Container key={index}>
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
                    backgroundColor={sp.styles.getColor('Link')}
                    popover={
                      <MText style={theme.colorWhite}>
                        {row.tooltip.title}
                      </MText>
                    }>
                    <Icon
                      name="information-variant"
                      size={15}
                      color="#AEB0B8"
                    />
                  </Tooltip>
                </View>
              )}
            </Row>
            <RowRight>
              <Info>{row.info}</Info>
            </RowRight>
          </Container>
        );
      })}
      {summary && (
        <B1 font="medium" top="L" left="L">
          Summary
        </B1>
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

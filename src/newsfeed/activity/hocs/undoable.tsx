import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { B2, Button, Column } from '../../../common/ui';
import ThemedStyles from '../../../styles/ThemedStyles';
import Activity, { ActivityProps } from '../Activity';
import { useAnalytics } from '../../../common/contexts/analytics.context';

/**
 * provides undoable functionality to the activity and handles the size and ui.
 * This HOC exposes an "onDownvote" props which should be called by the activity
 */
export default function undoable() {
  return (ActivityComponent: typeof Activity) =>
    observer(
      React.forwardRef(
        (props: ActivityProps, ref: React.Ref<ActivityProps>) => {
          const collapsed = props.entity._collapsed;
          const analytics = useAnalytics();

          const handleDownvote = useCallback(() => {
            props.entity.setCollapsed?.(true);
          }, [props.entity]);

          const handleUndo = useCallback(() => {
            props.entity.toggleVote('down').then(() => {
              analytics.trackClick('vote:down');
            });
            props.entity.setCollapsed?.(false);
          }, [analytics, props.entity]);

          if (!props.hidePostOnDownvote || !collapsed) {
            return (
              <ActivityComponent
                {...props}
                // @ts-ignore
                ref={ref}
              />
            );
          }

          return (
            <View
              style={collapsed ? styles.collapsedStyle : styles.regularStyle}>
              <ActivityComponent
                onDownvote={handleDownvote}
                {...props}
                // @ts-ignore
                ref={ref}
              />
              {collapsed && (
                <View style={styles.container}>
                  <Column flex>
                    <B2>
                      Thank you! Use this to control your feed and improve
                      recommendations.
                    </B2>
                  </Column>
                  <Column align="centerBoth">
                    <Button onPress={handleUndo}>Undo</Button>
                  </Column>
                </View>
              )}
            </View>
          );
        },
      ) as any,
    );
}

const styles = ThemedStyles.create({
  container: [
    'bgPrimaryBackground',
    'rowJustifySpaceBetween',
    'paddingHorizontal5x',
    'centered',
    'absoluteFill',
    'borderBottom6x',
    'bcolorBaseBackground',
  ],
  collapsedStyle: {
    overflow: 'hidden',
    height: 120,
  },
  regularStyle: {
    overflow: 'hidden',
  },
});

import React from 'react';
import { Skeleton } from 'moti/skeleton';
import ThemedStyles from '~/styles/ThemedStyles';
import { withSpacer } from '../ui';

// placeholder gradient colors
const PrimaryColor = 'Separator';
const SecondaryColor = 'PrimaryBackgroundHighlight';

function getColors() {
  return [
    ThemedStyles.getColor(PrimaryColor),
    ThemedStyles.getColor(SecondaryColor),
    ThemedStyles.getColor(PrimaryColor),
    ThemedStyles.getColor(SecondaryColor),
    ThemedStyles.getColor(PrimaryColor),
    ThemedStyles.getColor(SecondaryColor),
  ];
}

/**
 * Themed placeholder
 */
function Placeholder(props) {
  // stable reference to array
  const { current: colors } = React.useRef(getColors());

  return <Skeleton colors={colors} {...props} />;
}

export default withSpacer(Placeholder);

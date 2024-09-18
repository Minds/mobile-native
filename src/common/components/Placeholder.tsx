import React from 'react';
import { Skeleton } from 'moti/skeleton';

import { withSpacer } from '../ui';
import sp from '~/services/serviceProvider';
// placeholder gradient colors
const PrimaryColor = 'Separator';
const SecondaryColor = 'PrimaryBackgroundHighlight';

function getColors() {
  return [
    sp.styles.getColor(PrimaryColor),
    sp.styles.getColor(SecondaryColor),
    sp.styles.getColor(PrimaryColor),
    sp.styles.getColor(SecondaryColor),
    sp.styles.getColor(PrimaryColor),
    sp.styles.getColor(SecondaryColor),
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

import { View } from 'react-native';
import MText from '~/common/components/MText';
import ActivityModel from '~/newsfeed/ActivityModel';
import sp from '~/services/serviceProvider';

export const LockNetworkTag = ({ entity }: { entity: ActivityModel }) => {
  if (!entity.site_membership) {
    return null;
  }

  const unlock = entity.site_membership_unlocked;
  return (
    <View style={unlock ? styles.wrapperUnlockStyle : styles.wrapperStyle}>
      <MText
        numberOfLines={1}
        style={unlock ? styles.memberUnlockStyle : styles.memberStyle}>
        Membership
      </MText>
    </View>
  );
};

const wrapperStyle = sp.styles.combine('bcolorIconActive', 'bgLink', {
  borderWidth: 1,
  borderRadius: 3,
  paddingTop: 2,
  paddingHorizontal: 4,
  marginRight: 5,
  marginVertical: 2,
  maxWidth: '45%',
});

const memberStyle = sp.styles.combine('colorButtonText', {
  fontFamily: 'Roboto_500',
  fontSize: 12,
  lineHeight: 14,
});

const styles = {
  wrapperStyle,
  memberStyle,
  wrapperUnlockStyle: sp.styles.combine(...wrapperStyle, 'bgTransparent'),
  memberUnlockStyle: sp.styles.combine(...memberStyle, 'colorPrimaryText'),
};

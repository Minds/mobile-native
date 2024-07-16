import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import MText from '~/common/components/MText';
import FeedStore from '~/common/stores/FeedStore';
import GroupModel from '~/groups/GroupModel';
import GroupsListItem from '~/groups/GroupsListItem';

import ModalContainer from './ModalContainer';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

/**
 * Subscribe groups Modal Screen
 */
export default withErrorBoundaryScreen(
  observer(function SuggestedGroupsScreen() {
    const theme = sp.styles.style;
    const { current: listStore } = useRef(new FeedStore<GroupModel>());
    useEffect(() => {
      listStore
        .setEndpoint('api/v2/feeds/global/hot/groups')
        .setLimit(12)
        .setInjectBoost(false)
        .setAsActivities(true)
        .setParams({
          period: '1y',
          nsfw: [],
        })
        .fetchRemoteOrLocal();
    }, [listStore]);
    const i18n = sp.i18n;
    return (
      <ModalContainer
        title={i18n.t('onboarding.joinGroup')}
        contentContainer={theme.alignSelfCenterMaxWidth}
        onPressBack={sp.navigation.goBack}>
        <View style={[theme.flexContainer, theme.paddingHorizontal2x]}>
          <MText
            style={[
              theme.subTitleText,
              theme.colorPrimaryText,
              theme.paddingHorizontal2x,
            ]}>
            {i18n.t('onboarding.suggestedGroupsDescription')}
          </MText>
          <ScrollView style={theme.flexContainer}>
            {listStore.loading && <CenteredLoading />}
            {listStore.entities
              .slice()
              .map((group, index) =>
                group instanceof GroupModel ? (
                  <GroupsListItem
                    index={index}
                    group={group}
                    key={group.guid}
                    noNavigate
                  />
                ) : null,
              )}
          </ScrollView>
        </View>
      </ModalContainer>
    );
  }),
  'SuggestedGroupsScreen',
);

import navigation from '../../../../navigation/NavigationService';
import logService from '../../log.service';
import entitiesService from '../../entities.service';
import featuresService from '../../features.service';

export const parseByEntityType = (data: any) => {
  const [entity_type_one, entity_type_two] = data.json.entity_type.split(':');

  if (entity_type_one === 'comment') {
    navigateToActivityOrGroup(data);
    return;
  }

  if (entity_type_one === 'activity' || entity_type_one === 'object') {
    navigation.navigate('App', {
      screen: 'Activity',
      params: { guid: data.json.entity_guid },
    });
    return;
  }

  if (entity_type_two === 'blog') {
    navigation.navigate('App', {
      screen: 'BlogView',
      params: { guid: data.json.entity_guid },
    });
    return;
  }

  const err = new Error(
    `[DeepLinkRouter] Unknown notification, entity_type: ${data.json.entity_type}`,
  );
  logService.exception('[DeepLinkRouter] Unknown notification:', err);
};

export const parseComment = async (data: any) => {
  const guid = data.json.child_guid
    ? data.json.child_guid
    : data.json.entity_guid;

  const entity = <any>await entitiesService.single('urn:entity:' + guid);

  if (data.json.entity_type === 'group') {
    navigation.navigate('App', {
      screen: 'GroupView',
      params: {
        guid,
        tab: 'conversation',
        focusedUrn: data.json.focusedCommentUrn,
      },
    });
  } else {
    navigation.navigate('App', {
      screen: 'Activity',
      params: {
        entity,
        focusedUrn: data.json.focusedCommentUrn,
      },
    });
  }
};

export const parseReward = () => {
  if (featuresService.has('crypto')) {
    navigation.navigate('App', {
      screen: 'Wallet',
    });
  } else {
    navigation.navigate('App', {
      screen: 'Notifications',
    });
  }
};

export const error = (data: any, errorType: string) => {
  navigation.navigate('App', {
    screen: 'Notifications',
  });
  logService.error(`[DeepLinkRouter] ${errorType}: ${JSON.stringify(data)}`);
};

const navigateToActivityOrGroup = async (data: any) => {
  try {
    const entity = <any>(
      await entitiesService.single('urn:entity:' + data.json.parent_guid)
    );

    if (entity.type === 'group') {
      navigation.push('App', {
        screen: 'GroupView',
        params: {
          guid: data.json.parent_guid,
          tab: 'conversation',
          focusedUrn: data.json.focusedCommentUrn,
        },
      });
    } else {
      navigation.navigate('App', {
        screen: 'Activity',
        params: { entity: entity, focusedUrn: data.json.focusedCommentUrn },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

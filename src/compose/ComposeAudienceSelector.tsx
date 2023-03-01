import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { confirm } from '../common/components/Confirm';
import Link from '../common/components/Link';
import OffsetList from '../common/components/OffsetList';
import { pushBottomSheet } from '../common/components/bottom-sheet';
import MenuItem from '../common/components/menus/MenuItem';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import abbrev from '../common/helpers/abbrev';
import i18nService from '../common/services/i18n.service';
import supportTiersService from '../common/services/support-tiers.service';
import { B1, B2, Button, Icon, Screen, ScreenHeader } from '../common/ui';
import GroupModel from '../groups/GroupModel';
import ThemedStyles from '../styles/ThemedStyles';
import type { SupportTiersType } from '../wire/WireTypes';
import { ComposeAudience } from './createComposeStore';
import { ComposeStoreType } from './useComposeStore';

const BOTTOM_SHEET_HEIGHT = Math.floor(Dimensions.get('window').height * 0.8);

interface AudienceSelectorSheetProps {
  store: ComposeStoreType;
  onClose: () => void;
}

const AudienceSelectorSheet = observer((props: AudienceSelectorSheetProps) => {
  const { store, onClose } = props;
  const [supportTiers, setSupportTiers] = useState<SupportTiersType[]>([]);
  const selected = store.audience;

  const texts = {
    title: 'Select Audience',
    done: i18nService.t('done'),
    audience: {
      public: {
        title: 'Public',
      },
      plus: {
        title: 'Minds+',
        subtitle:
          'Submit this post to Minds+ Premium Content and earn a share of our revenue based on how it performs.',
      },
    },
    memberships: 'Memberships',
    groups: 'Groups',
  };

  const select = useCallback(
    async audience => {
      switch (audience.type) {
        case 'public':
          store.clearWireThreshold();
          break;
        case 'plus':
          if (
            !(await confirm({
              title: 'Plus monetization',
              actionText: 'I agree to the terms',
              description: <PlusTerms />,
            }))
          ) {
            return;
          }

          store.savePlusMonetize(null);
          break;
        case 'membership':
          if (audience.tier) {
            store.saveMembsershipMonetize(audience.tier);
          }
          break;
        case 'group':
          if (audience.group) {
            store.setGroup(audience.group);
          }
          break;
      }

      store.setAudience(audience);
    },
    [store],
  );

  useEffect(() => {
    supportTiersService
      .getAllFromUser()
      .then(tiers => tiers && setSupportTiers(tiers));
  }, []);

  const renderGroup = useCallback(
    (row: { item: GroupModel; index: number }) => {
      const group = GroupModel.checkOrCreate(row.item);
      return (
        <ComposeAudienceGroup
          group={group}
          selected={selected.type === 'group' && selected.value === group.guid}
          onPress={() => select({ type: 'group', value: group.guid, group })}
          index={row.index}
        />
      );
    },
    [selected.type, selected.value, select],
  );

  return (
    <Screen safe edges={['bottom']}>
      <ScreenHeader
        title={texts.title}
        back
        titleType="H3"
        backIcon="close"
        centerTitle
        extra={
          <Button mode="flat" onPress={onClose}>
            {texts.done}
          </Button>
        }
      />
      <OffsetList
        ListComponent={BottomSheetFlatList}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 200 }}
        header={
          <>
            <MenuItemOption
              title={texts.audience.public.title}
              mode="radio"
              icon={selected.type === 'public' ? <Check /> : <CheckBlank />}
              onPress={() => select({ type: 'public' })}
              reversedIcon
              borderless
              selected
            />
            <MenuItemOption
              title={texts.audience.plus.title}
              subtitle={texts.audience.plus.subtitle}
              mode="radio"
              icon={selected.type === 'plus' ? <Check /> : <CheckBlank />}
              onPress={() => select({ type: 'plus' })}
              reversedIcon
              borderless
            />
            {!!supportTiers.length && (
              <>
                <B1 left="XL" top="M" font="bold">
                  {texts.memberships}
                </B1>
                {supportTiers.map(tier => (
                  <MenuItemOption
                    title={tier.name}
                    subtitle={tier.description}
                    reversedIcon
                    borderless
                    selected={
                      selected.type === 'membership' &&
                      selected.value === tier.guid
                    }
                    onPress={() =>
                      select({
                        type: 'membership',
                        value: tier.guid,
                        tier,
                      })
                    }
                    icon={
                      selected.type === 'membership' &&
                      selected.value === tier.guid ? (
                        <Check />
                      ) : (
                        <CheckBlank />
                      )
                    }
                  />
                ))}
              </>
            )}

            <B1 left="XL" top="M" font="bold">
              {texts.groups}
            </B1>
          </>
        }
        renderItem={renderGroup}
        fetchEndpoint={'api/v1/groups/member'}
        endpointData={'groups'}
      />
    </Screen>
  );
});

const ComposeAudienceGroup = ({ group, selected, onPress, index }) => {
  const avatarSource = group?.getAvatar?.();

  const commonProps = {
    title: group.name,
    subtitle: i18nService.t('groups.listMembersCount', {
      count: abbrev(group['members:count']),
    }),
    borderless: true,
    onPress,
    avatarSize: 30,
    noBorderTop: typeof index === 'number' && index > 0,
  };

  if (selected) {
    return <MenuItem {...commonProps} icon={<Check />} reversedIcon />;
  }

  return <MenuItem {...commonProps} avatar={avatarSource?.source} noIcon />;
};

const Check = () => (
  <View style={styles.check}>
    <Icon name="check" color="White" size="small" />
  </View>
);

const CheckBlank = () => <View style={styles.checkBlank} />;

const PlusTerms = () => (
  <>
    <B2 bottom="L">
      I agree to the{' '}
      <Link url="https://www.minds.com/p/monetization-terms">
        Minds monetization terms{' '}
      </Link>
      and have the rights to monetize this content.
    </B2>
    <B2>• This content is my original content</B2>
    <B2 bottom="L">• This content is exclusive to Minds+</B2>
    <B2>
      I understand that violation of these requirements may result in losing the
      ability to publish Premium Content for Minds+ members.
    </B2>
  </>
);

const styles = ThemedStyles.create({
  list: { height: BOTTOM_SHEET_HEIGHT },
  rounded: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  get check() {
    return [this.rounded, 'bgLink', 'centered'];
  },
  get checkBlank() {
    return [this.rounded, 'border2x', 'bcolorActive'];
  },
});

const ComposeAudienceSelector = ({ store }: { store: ComposeStoreType }) => {
  const audienceMapping: Record<ComposeAudience['type'], string> = {
    public: 'Public',
    plus: 'Minds+',
    group: 'Group',
    membership: 'Membership',
  };

  const onPress = () =>
    pushBottomSheet({
      snapPoints: [BOTTOM_SHEET_HEIGHT],
      component: (bottomSheetRef, handleContentLayout) => (
        <View onLayout={handleContentLayout}>
          <AudienceSelectorSheet
            store={store}
            onClose={() => bottomSheetRef.close()}
          />
        </View>
      ),
    });

  return (
    <Button fit font="regular" size="pill" right="XL" onPress={onPress}>
      {audienceMapping[store.audience.type]}
    </Button>
  );
};

export default observer(ComposeAudienceSelector);

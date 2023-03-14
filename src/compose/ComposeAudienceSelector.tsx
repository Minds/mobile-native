import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { confirm } from '../common/components/Confirm';
import Link from '../common/components/Link';
import OffsetList from '../common/components/OffsetList';
import { pushBottomSheet } from '../common/components/bottom-sheet';
import MenuItem from '../common/components/menus/MenuItem';
import MenuItemOption from '../common/components/menus/MenuItemOption';
import abbrev from '../common/helpers/abbrev';
import { useLegacyStores } from '../common/hooks/use-stores';
import i18n from '../common/services/i18n.service';
import { useSupportTiers } from '../common/services/support-tiers.service';
import {
  B1,
  B2,
  Button,
  Column,
  Icon,
  Row,
  Screen,
  ScreenHeader,
} from '../common/ui';
import { IS_IOS, PRO_PLUS_SUBSCRIPTION_ENABLED } from '../config/Config';
import GroupModel from '../groups/GroupModel';
import NavigationService from '../navigation/NavigationService';
import ThemedStyles from '../styles/ThemedStyles';
import { upgradeToPlus } from '../upgrade/UpgradeScreen';
import { ComposeAudience } from './createComposeStore';
import { ComposeStoreType } from './useComposeStore';
import { Trans } from 'react-i18next';

const BOTTOM_SHEET_HEIGHT = Math.floor(Dimensions.get('window').height * 0.8);

interface AudienceSelectorSheetProps {
  store: ComposeStoreType;
  /**
   * whether only monetized options should be shown
   */
  monetizedOnly?: boolean;
  onClose: () => void;
}

const AudienceSelectorSheet = observer((props: AudienceSelectorSheetProps) => {
  const navigation = useNavigation();
  const { store, onClose, monetizedOnly } = props;
  const {
    supportTiers,
    loading: supportTiersLoading,
    refresh,
  } = useSupportTiers();
  const { user } = useLegacyStores();
  const [groupsVisible, setGroupsVisible] = useState(!monetizedOnly);
  const selected = store.audience;

  const select = useCallback(
    async audience => {
      switch (audience.type) {
        case 'public':
          store.clearWireThreshold();
          break;
        case 'plus':
          if (!user.me.plus) {
            if (!(await upgradeToPlus(navigation))) {
              return;
            }
          }

          if (
            !(await confirm({
              title: texts.plus.title,
              actionText: texts.plus.action,
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
    [navigation, store, user.me.plus],
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );

  const renderGroup = useCallback(
    (row: { item: GroupModel; index: number }) => {
      const group = GroupModel.checkOrCreate(row.item);
      return (
        <ComposeAudienceGroupItem
          group={group}
          selected={selected.type === 'group' && selected.value === group.guid}
          onPress={() => select({ type: 'group', value: group.guid, group })}
          index={row.index}
        />
      );
    },
    [selected.type, selected.value, select],
  );

  const content = (
    <>
      {!monetizedOnly && (
        <MenuItemOption
          title={texts.audience.public.title}
          mode="radio"
          icon={selected.type === 'public' ? <Check /> : <CheckBlank />}
          onPress={() => select({ type: 'public' })}
          reversedIcon
          borderless
          selected
        />
      )}

      {!!PRO_PLUS_SUBSCRIPTION_ENABLED && (
        <MenuItemOption
          title={texts.audience.plus.title}
          subtitle={texts.audience.plus.subtitle}
          mode="radio"
          icon={selected.type === 'plus' ? <Check /> : <CheckBlank />}
          onPress={() => select({ type: 'plus' })}
          reversedIcon
          borderless
        />
      )}

      {!IS_IOS && (
        <>
          <Row align="centerBetween">
            <B1 left="XL" top="M" font="bold">
              {texts.memberships}
            </B1>

            {!!supportTiers.length && (
              <Button
                size="tiny"
                mode="flat"
                type="action"
                top="S"
                onPress={() => NavigationService.push('TierManagementScreen')}>
                {texts.manage}
              </Button>
            )}
          </Row>

          {supportTiers.map(tier => (
            <MenuItemOption
              title={tier.name}
              subtitle={`${tier.description}${
                tier.description ? '\n' : ''
              }${i18n.t('membership.monthly', { usd: tier.usd })}`}
              reversedIcon
              borderless
              selected={
                selected.type === 'membership' && selected.value === tier.guid
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

          {!supportTiers.length && !supportTiersLoading && (
            <Column horizontal="XL" top="M">
              <B2 color="secondary">
                {i18n.t('monetize.membershipMonetize.descriptionLong')}
              </B2>
              <Button
                align="center"
                size="small"
                mode="solid"
                type="action"
                vertical="L"
                onPress={() => NavigationService.push('TierManagementScreen')}>
                {texts.getStarted}
              </Button>
            </Column>
          )}
        </>
      )}

      {!monetizedOnly && groupsVisible && (
        <Row align="centerBetween">
          <B1 left="XL" top="L" font="bold">
            {texts.groups}
          </B1>

          <Button
            size="tiny"
            mode="flat"
            type="action"
            top="S"
            onPress={() => NavigationService.navigate('GroupsList')}>
            {texts.manage}
          </Button>
        </Row>
      )}
    </>
  );

  return (
    <Screen safe edges={['bottom']}>
      <ScreenHeader
        title={texts.title}
        back
        onBack={onClose}
        titleType="H3"
        backIcon="close"
        centerTitle
        extra={
          <Button mode="flat" onPress={onClose}>
            {texts.done}
          </Button>
        }
      />
      {monetizedOnly ? (
        <ScrollView style={{ height: BOTTOM_SHEET_HEIGHT }}>
          {content}
        </ScrollView>
      ) : (
        <OffsetList
          ListComponent={BottomSheetFlatList}
          style={styles.list}
          contentContainerStyle={styles.listPadding}
          header={content}
          onListUpdate={groups => setGroupsVisible(!!groups.length)}
          renderItem={renderGroup}
          fetchEndpoint={'api/v1/groups/member'}
          endpointData={'groups'}
        />
      )}
    </Screen>
  );
});

const ComposeAudienceGroupItem = ({ group, selected, onPress, index }) => {
  const avatarSource = group?.getAvatar?.();

  const commonProps = {
    title: group.name,
    subtitle: i18n.t('groups.listMembersCount', {
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
      <Trans
        i18nKey="monetize"
        defaults={i18n.t('monetize.terms.title')}
        components={{
          'terms-link': <TermsLink />,
        }}
      />
    </B2>
    <B2>• {i18n.t('monetize.terms.originalContent')}</B2>
    <B2 bottom="L">• {i18n.t('monetize.terms.exclusive')}</B2>
    <B2>{i18n.t('monetize.terms.violations')}</B2>
  </>
);

const TermsLink = () => (
  <Link url="https://www.minds.com/p/monetization-terms">
    {i18n.t('monetize.terms.linkTitle')}
  </Link>
);

export const pushAudienceSelector = (
  props: Omit<AudienceSelectorSheetProps, 'onClose'>,
) =>
  new Promise(resolve =>
    pushBottomSheet({
      snapPoints: [BOTTOM_SHEET_HEIGHT],
      onClose: () => resolve(false),
      component: (bottomSheetRef, handleContentLayout) => (
        <View onLayout={handleContentLayout}>
          <AudienceSelectorSheet
            {...props}
            onClose={() => {
              resolve(true);
              bottomSheetRef.close();
            }}
          />
        </View>
      ),
    }),
  );

const audienceMapping: Record<ComposeAudience['type'], string> = {
  public: i18n.t('composer.audienceSelector.titles.public'),
  plus: i18n.t('composer.audienceSelector.titles.plus'),
  group: i18n.t('composer.audienceSelector.titles.group'),
  membership: i18n.t('composer.audienceSelector.titles.membership'),
};

const ComposeAudienceSelector = ({ store }: { store: ComposeStoreType }) => {
  return (
    <Button
      fit
      font="regular"
      size="pill"
      darkContent
      right="XL"
      onPress={() => pushAudienceSelector({ store })}>
      {audienceMapping[store.audience.type]}
    </Button>
  );
};

export default observer(ComposeAudienceSelector);

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
  listPadding: { paddingBottom: 200 },
});

const texts = {
  title: i18n.t('composer.audienceSelector.title'),
  done: i18n.t('composer.audienceSelector.done'),
  audience: {
    public: {
      title: i18n.t('composer.audienceSelector.audience.public.title'),
    },
    plus: {
      title: i18n.t('composer.audienceSelector.audience.plus.title'),
      subtitle: i18n.t('composer.audienceSelector.audience.plus.subtitle'),
    },
  },
  memberships: i18n.t('composer.audienceSelector.memberships'),
  groups: i18n.t('composer.audienceSelector.groups'),
  noGroups: i18n.t('composer.audienceSelector.noGroups'),
  plus: {
    title: i18n.t('composer.audienceSelector.plus.title'),
    action: i18n.t('composer.audienceSelector.plus.action'),
  },
  manage: i18n.t('composer.audienceSelector.manage'),
  getStarted: i18n.t('composer.audienceSelector.getStarted'),
};

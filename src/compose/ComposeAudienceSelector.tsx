import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useRef } from 'react';
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
  title?: string;
  mode?: 'groups' | 'monetized';
  store?: ComposeStoreType;
  onClose: () => void;
  // overrides the default onSelect functionality
  onSelect?: (audience: ComposeAudience) => void;
}

const AudienceSelectorSheet = observer((props: AudienceSelectorSheetProps) => {
  const navigation = useNavigation();
  const { store, onClose, title, mode } = props;
  const {
    supportTiers,
    loading: supportTiersLoading,
    refresh: refreshSupportTiers,
  } = useSupportTiers(IS_IOS);
  const { user } = useLegacyStores();
  const selected = store?.audience ?? { type: 'public' };
  const groupsListRef = useRef<any>(null);

  const handleSelect = useCallback(
    async audience => {
      if (!store) {
        return;
      }

      if (audience.type !== 'group') {
        store.setGroup(null);
      }

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

  const select = props.onSelect ?? handleSelect;

  useFocusEffect(
    useCallback(() => {
      if (!IS_IOS) {
        refreshSupportTiers();
      }

      groupsListRef.current?.refreshList?.();
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
      {!mode && (
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

      {!mode && !!PRO_PLUS_SUBSCRIPTION_ENABLED && (
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

      {!IS_IOS && mode !== 'groups' && (
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
              key={tier.guid}
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

      {mode !== 'monetized' && (
        <Row align="centerBetween">
          <B1 left="XL" top="L" font="bold">
            {texts.groups}
          </B1>
        </Row>
      )}
    </>
  );

  return (
    <Screen safe edges={['bottom']}>
      <ScreenHeader
        title={title ?? texts.title}
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
      {mode === 'monetized' ? (
        <ScrollView style={{ height: BOTTOM_SHEET_HEIGHT }}>
          {content}
        </ScrollView>
      ) : (
        <OffsetList
          sticky
          ref={groupsListRef}
          ListComponent={BottomSheetFlatList}
          style={styles.list}
          contentContainerStyle={styles.listPadding}
          header={content}
          renderItem={renderGroup}
          ListEmptyComponent={
            <>
              <Column horizontal="XL" top="M" align="centerStart">
                <B1 color="secondary">{texts.noGroups}</B1>
                <Button
                  mode="outline"
                  top="L"
                  onPress={() => {
                    NavigationService.push('GroupsDiscovery');
                  }}>
                  {texts.discoverGroups}
                </Button>
              </Column>
            </>
          }
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

const ComposeAudienceSelector = ({ store }: { store: ComposeStoreType }) => {
  const audienceMapping: Record<ComposeAudience['type'], string> = {
    public: i18n.t('composer.audienceSelector.titles.public'),
    plus: i18n.t('composer.audienceSelector.titles.plus'),
    group: store.audience.group?.name ?? '',
    membership: store.audience.tier?.name ?? '',
  };

  return (
    <Button
      right="XXXL2"
      font="regular"
      size="pill"
      type="action"
      mode="outline"
      color="link"
      reversedIcon
      icon={<Icon name="chevron-down" color="Link" size="small" />}
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
    return [this.rounded, 'bgLink', 'centered', 'marginTop2x'];
  },
  get checkBlank() {
    return [this.rounded, 'border2x', 'bcolorActive', 'marginTop2x'];
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
  discoverGroups: i18n.t('composer.audienceSelector.discoverGroups'),
  plus: {
    title: i18n.t('composer.audienceSelector.plus.title'),
    action: i18n.t('composer.audienceSelector.plus.action'),
  },
  manage: i18n.t('composer.audienceSelector.manage'),
  getStarted: i18n.t('composer.audienceSelector.getStarted'),
};

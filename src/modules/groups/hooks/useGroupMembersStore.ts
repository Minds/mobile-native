import { useLocalStore } from 'mobx-react';

import UserModel from '~/channel/UserModel';
import logService from '~/common/services/log.service';
import OffsetListStore from '~/common/stores/OffsetListStore';
import groupsService from '~/groups/GroupsService';

export const useGroupMembersStore = group => {
  return useLocalStore(() => ({
    group,
    loading: false,
    members: new OffsetListStore<UserModel>('shallow'),
    search: '',
    showSearch: false,

    toggleMenu() {
      this.showSearch = !this.showSearch;
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.setSearch('');
      }
    },
    setSearch(value: string) {
      this.search = value;

      this.members.clearList();
      this.loading = false;
      this.loadMore();
    },
    async refresh() {
      this.members.refreshing = true;
      try {
        this.members.clearList();
        await this.loadMore();
      } catch (error) {
        logService.exception(error);
      }
      this.members.refreshing = false;
    },
    async loadMore() {
      if (this.members.cantLoadMore() || this.loading) {
        return;
      }

      this.loading = true;

      const serviceFetch = this.search
        ? groupsService.searchMembers(
            this.group.guid,
            this.members.offset,
            21,
            this.search,
          )
        : groupsService.loadMembers(this.group.guid, this.members.offset);

      try {
        const data: any = await serviceFetch;
        data.entities = UserModel.createMany(data.members);
        data.offset = data['load-next'];
        this.members.setList(data);
      } catch (error) {
        logService.exception(error);
      } finally {
        this.loading = false;
      }
    },
    async kick(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.kick(this.group.guid, user.guid);
      if (result.done) {
        this.members.remove(user);
      }
    },

    /**
     * Ban given user
     * @param {object} user
     */
    async ban(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.ban(this.group.guid, user.guid);
      if (result.done) {
        this.members.remove(user);
      }
    },

    /**
     * Make given user moderator
     * @param {object} user
     */
    async makeModerator(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.makeModerator(
        this.group.guid,
        user.guid,
      );
      if (result.done) {
        user['is:moderator'] = true;
      }
    },

    /**
     * Revoke moderator to given user
     * @param {object} user
     */
    async revokeModerator(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.revokeModerator(
        this.group.guid,
        user.guid,
      );
      if (result.done) {
        user['is:moderator'] = false;
      }
    },

    /**
     * Make given user owner
     * @param {object} user
     */
    async makeOwner(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.makeOwner(
        this.group.guid,
        user.guid,
      );
      if (result.done) {
        user['is:owner'] = true;
      }
    },

    /**
     * Revoke ownership to given user
     */
    async revokeOwner(user: UserModel) {
      if (!this.group) {
        return;
      }

      const result: any = await groupsService.revokeOwner(
        this.group.guid,
        user.guid,
      );
      if (result.done) {
        user['is:owner'] = false;
      }
    },
  }));
};

export type GroupMembersStoreType = ReturnType<typeof useGroupMembersStore>;

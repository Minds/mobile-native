import { ApiConnector, persistData, rehydrateData } from 'services/api';

export type TaskResult = [string, any];
export type Task = () => Promise<TaskResult | void>;

export const TAG = 'myToken';

export const loadingMainTasks = (): Task[] => {
  const mainTasks: Task[] = [
    async () => {
      ApiConnector.getInstance('minds', {
        baseURL: 'https://www.minds.com/api',
        tokenRehydrate: rehydrateData(TAG),
        tokensPersist: persistData(TAG),
      });
    },
  ];
  return mainTasks;
};

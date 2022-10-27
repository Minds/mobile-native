export type TaskResult = [string, any];
export type Task = () => Promise<TaskResult | void>;

export const loadingMainTasks = (): Task[] => {
  const mainTasks: Task[] = [async () => undefined];
  return mainTasks;
};

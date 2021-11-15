import useApiFetch from '~/common/hooks/useApiFetch';

export interface IQuestion {
  questionText: string;
  questionId: string;
  stepSize: number;

  defaultValue: number;
  currentValue: number;

  maximumRangeValue: number;
  minimumRangeValue: number;
  minimumStepLabel: string;
  maximumStepLabel: string;
}

export const useQuestions = () => {
  return useApiFetch<{ result; questions: IQuestion[] }>(
    'api/v3/social-compass/questions',
    {
      dataField: 'questions',
      persist: true,
    },
  );
};

import useApiFetch from '../../hooks/useApiFetch';

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
  return useApiFetch<{ questions: IQuestion[]; answersProvided: boolean }>(
    'api/v3/social-compass/questions',
    {
      dataField: 'questions',
      persist: false,
      retry: 2,
    },
  );
};

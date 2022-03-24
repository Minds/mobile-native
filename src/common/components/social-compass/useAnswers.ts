import { useApiCall } from '../../hooks/useApiFetch';
import { IQuestion } from './useQuestions';

export const useAnswers = (questions: IQuestion[]) => {
  const { post, ...rest } = useApiCall('api/v3/social-compass/answers');

  return {
    ...rest,
    answer: () => {
      const answers: { [k: string]: number } = {};
      questions.map(
        question => (answers[question.questionId] = question.currentValue),
      );
      return post({
        'social-compass-answers': answers,
      });
    },
  };
};

import {
  ComponentOnboardingV5OnboardingStep,
  GetOnboardingV5VersionsQuery,
  useGetOnboardingV5VersionsQuery,
} from '~/graphql/strapi';

const carouselExtractor = (data?: GetOnboardingV5VersionsQuery) => {
  const screens = [
    ...new Map(
      data?.onboardingV5Versions?.data?.[0]?.attributes?.steps
        ?.map(step => (step as ComponentOnboardingV5OnboardingStep)?.carousel)
        .flat()
        .map(item => [item?.title, { ...item?.media, title: item?.title }]),
    ).values(),
  ];
  return screens;
};

type Survey = {
  title: string | undefined;
  description: string | undefined;
  radioSurveyQuestion: string | null | undefined;
  radioSurvey:
    | Array<{
        id: string;
        optionTitle: string;
        optionDescription: string;
        optionKey: string;
      } | null>
    | null
    | undefined;
};

const surveyExtractor = (
  data?: GetOnboardingV5VersionsQuery,
): Survey[] | undefined => {
  return data?.onboardingV5Versions?.data?.[0]?.attributes?.steps
    ?.filter(step => {
      const { radioSurvey, radioSurveyQuestion } =
        (step as ComponentOnboardingV5OnboardingStep) ?? {};
      return radioSurvey && radioSurveyQuestion;
    })
    .map(step => {
      const { title, description, radioSurvey, radioSurveyQuestion } =
        (step as ComponentOnboardingV5OnboardingStep) ?? {};
      return { title, description, radioSurvey, radioSurveyQuestion };
    });
};

export const useCarouselData = () => {
  const { data: originalData, ...rest } = useGetOnboardingV5VersionsQuery();
  const data = carouselExtractor(originalData);
  return {
    noData: data.length === 0,
    data,
    ...rest,
  };
};

export const useSurveylData = () => {
  const { data: originalData, ...rest } = useGetOnboardingV5VersionsQuery();
  const data = surveyExtractor(originalData);
  return {
    noData: (data?.length ?? 0) === 0,
    data,
    ...rest,
  };
};

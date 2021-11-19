import React from 'react';
import 'react-native';
import { render } from '@testing-library/react-native';
import QuestionSlider from '../../../../src/common/components/social-compass/QuestionSlider';

const mockData = {
  questionText: 'questionText',
  questionId: 'questionId',
  stepSize: 1,
  defaultValue: 24,
  currentValue: 25,
  maximumRangeValue: 0,
  minimumRangeValue: 100,
  minimumStepLabel: 'minimumStepLabel',
  maximumStepLabel: 'maximumStepLabel',
};

describe('Slider component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<QuestionSlider question={mockData} />);
    expect(toJSON()).toMatchSnapshot();
  });
});

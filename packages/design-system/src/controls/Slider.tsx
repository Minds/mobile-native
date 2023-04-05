import { Slider as TSlider, SliderProps } from '@tamagui/slider';

export const Slider = (props: SliderProps) => (
  <TSlider size="$1.5" {...props}>
    <TSlider.Track backgroundColor="$grey-300">
      <TSlider.TrackActive backgroundColor="$action" />
    </TSlider.Track>
    <TSlider.Thumb
      circular
      index={0}
      borderColor="$colorTextPrimary"
      backgroundColor="$colorTextPrimary"
    />
  </TSlider>
);

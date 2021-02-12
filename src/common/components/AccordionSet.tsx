import React from 'react';
import { observer, useLocalStore } from 'mobx-react';
import Accordion from 'react-native-collapsible/Accordion';
import { TouchableOpacity } from 'react-native';

export type AccordionDataType = {
  title: string;
  children: React.ReactElement<{}>;
  subtitle?: string | React.ReactNode;
  tooltip?: {
    title: string;
    width: number;
    height: number;
  };
};

export type RenderFunction = (
  content: any,
  index: number,
  isActive: boolean,
  sections: Array<AccordionDataType>,
) => React.ReactElement<{}>;

type PropsType = {
  data: Array<AccordionDataType>;
  headerComponent: RenderFunction;
  contentComponent: RenderFunction;
};

const AccordionSet = observer((props: PropsType) => {
  const localStore = useLocalStore(() => ({
    activeSections: [] as Array<number>,
    setActiveSections(index: number) {
      this.activeSections = [index];
    },
    onChange(indexes: number[]) {
      this.setActiveSections(indexes[0]);
    },
  }));
  return (
    <Accordion
      sections={props.data}
      activeSections={localStore.activeSections}
      renderHeader={props.headerComponent}
      renderContent={props.contentComponent}
      onChange={localStore.onChange}
      touchableComponent={TouchableOpacity}
    />
  );
});

export default AccordionSet;

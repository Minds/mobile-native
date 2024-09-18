export interface InjectItemComponentProps {
  index: number;
  target: string;
}

/**
 * an item to be injected in feed
 */
export class InjectItem {
  /**
   * the indexes in the feed this item should be inserted
   */
  indexes: number | ((index: number) => boolean);
  type: string;
  onViewed?: () => void;
  /**
   * the component to render
   */
  component: (props: InjectItemComponentProps) => React.ReactElement;

  constructor(
    indexes: number | ((index: number) => boolean),
    type: string,
    component: (props: InjectItemComponentProps) => React.ReactElement,
    onViewed?: () => void,
  ) {
    this.component = component;
    this.type = type;
    this.indexes = indexes;

    this.onViewed = onViewed;
  }

  sendViewed() {
    if (this.onViewed) {
      this.onViewed();
    }
  }
}

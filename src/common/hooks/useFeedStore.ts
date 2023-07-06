import { useRef } from 'react';
import FeedStore from '../stores/FeedStore';

export default function useFeedStore(includeMetadata: boolean = false) {
  const ref = useRef<FeedStore>();
  if (!ref.current) {
    ref.current = new FeedStore(includeMetadata);
  }
  return ref.current;
}

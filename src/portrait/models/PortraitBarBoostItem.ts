import PortraitBarItem from './PortraitBarItem';

export class PortraitBarBoostItem extends PortraitBarItem {
  get unseen(): boolean {
    // always show boosts
    return true;
  }
}

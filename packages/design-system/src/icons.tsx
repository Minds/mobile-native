import React from 'react';
import { IconProps } from './IconProps';
import { Adjust } from './icons/Adjust';
import { Boost } from './icons/Boost';
import { Camera } from './icons/Camera';
import { Chat } from './icons/Chat';
import { Chevron } from './icons/Chevron';
import { Clear } from './icons/Clear';
import { Downvote } from './icons/Downvote';
import { EllipsisH } from './icons/EllipsisH';
import { EllipsisV } from './icons/EllipsisV';
import { Emoji } from './icons/Emoji';
import { Explicit } from './icons/Explicit';
import { Gallery } from './icons/Gallery';
import { Group } from './icons/Group';
import { Hashtag } from './icons/Hashtag';
import { Help } from './icons/Help';
import { Info } from './icons/Info';
import { Launch } from './icons/Launch';
import { Lightmode } from './icons/Lightmode';
import { List } from './icons/List';
import { Location } from './icons/Location';
import { Menu } from './icons/Menu';
import { MindsPlus } from './icons/MindsPlus';
import { MindsPlusBadge } from './icons/MindsPlusBadge';
import { Notifications } from './icons/Notifications';
import { Remind } from './icons/Remind';
import { Search } from './icons/Search';
import { Send } from './icons/Send';
import { Settings } from './icons/Settings';
import { Supermind } from './icons/Supermind';
import { SwitchAccount } from './icons/SwitchAccount';
import { Tags } from './icons/Tags';
import { Tip } from './icons/Tip';
import { Upvote } from './icons/Upvote';
import { VerifiedBadge } from './icons/VerifiedBadge';
import { Wallet } from './icons/Wallet';
import { MindsPro } from './icons/MindsPro';
import { Verified } from './icons/Verified';
import { CaptivePortal } from './icons/CaptivePortal';

export const icons = {
  adjust: Adjust,
  boost: Boost,
  camera: Camera,
  chat: Chat,
  chevron: Chevron,
  clear: Clear,
  downvote: Downvote,
  ellipsisH: EllipsisH,
  ellipsisV: EllipsisV,
  emoji: Emoji,
  explicit: Explicit,
  gallery: Gallery,
  group: Group,
  hashtag: Hashtag,
  help: Help,
  captivePortal: CaptivePortal,
  info: Info,
  launch: Launch,
  lightmode: Lightmode,
  list: List,
  location: Location,
  menu: Menu,
  mindsPlus: MindsPlus,
  mindsPlusBadge: MindsPlusBadge,
  notifications: Notifications,
  remind: Remind,
  search: Search,
  send: Send,
  settings: Settings,
  supermind: Supermind,
  switchAccount: SwitchAccount,
  tags: Tags,
  tip: Tip,
  upvote: Upvote,
  verifiedBadge: VerifiedBadge,
  wallet: Wallet,
  mindsPro: MindsPro,
  verified: Verified,
};

export {
  Adjust,
  Boost,
  Camera,
  Chat,
  Chevron,
  Clear,
  Downvote,
  EllipsisH,
  EllipsisV,
  Emoji,
  Explicit,
  Gallery,
  Group,
  Hashtag,
  Help,
  CaptivePortal,
  Info,
  Launch,
  Lightmode,
  List,
  Location,
  Menu,
  MindsPlus,
  MindsPlusBadge,
  Notifications,
  Remind,
  Search,
  Send,
  Settings,
  Supermind,
  SwitchAccount,
  Tags,
  Tip,
  Upvote,
  VerifiedBadge,
  Wallet,
  MindsPro,
  Verified,
};

export type IconNames = keyof typeof icons;

export const Icon = ({
  name,
  ...props
}: IconProps & {
  name: IconNames;
}) => React.createElement(icons[name], { ...props });

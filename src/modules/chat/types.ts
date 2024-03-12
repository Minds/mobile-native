export type ChatMessage = {
  id: string;
  plainText: string;
  sender: {
    username: string;
    guid: string;
  };
  timeCreatedISO8601: string;
  timeCreatedUnix: string;
};

// subset of UserModel
export type ChatMember = {
  guid: string;
  username: string;
  avatar: string;
};

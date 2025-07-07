export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
};

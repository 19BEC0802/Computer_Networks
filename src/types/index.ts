export type User = {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'image' | 'document';
};

export type ChatState = {
  messages: Message[];
  users: Record<string, User>;
  currentUser: User | null;
  isTyping: boolean;
};
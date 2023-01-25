export type User = {
  id: string;
  email: string;
  username: string;
  u_name: string;
  emailVerified: string | null;
  image: string | null;
  peer: UserPeer;
} | null;

export type UserPeer = {
  id: string;
};

export type Notification = {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
};

export type Errors = {
  email?: string;
  username?: string;
  password?: string;
  token?: string;
} | null;

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  password: string;
};

export type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  status: "pending" | "accepted" | "rejected";
};

export type Friend = {
  id: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
};

export type Conversation = {
  id: string;
  participants: Array<Participant>;
  createdAt: string;
};

export type Message = {
  id: string;
  content: string;
  conversationId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Participant = {
  id: string;
  userId: string;
  user: User;
  conversationId: string;
  conversation: Conversation;
  isTyping: boolean;
};

export type CallInitiatePayload = {
  localStream: MediaStream;
  isCalling: boolean;
  activeConversationId: string;
  caller: User;
  receiver: User;
  callType: CallType;
};

export type CallPayload = {
  recipientId: string;
  conversationId: string;
  caller: User;
};

export type AcceptedCallPayload = {
  acceptor: User;
  caller: User;
  conversation: Conversation;
};

export type CallType = "video" | "audio";

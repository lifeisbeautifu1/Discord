import { Conversation, User } from "@prisma/client";
import { Request } from "express";
import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  user: User;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type ConversationPopulated = Conversation & {
  participants: {
    user: {
      id: string;
      username: string;
      u_name: string;
      image: string;
    };
  }[];
};

export type TypingPayload = {
  userId: string;
  conversationId: string;
};

export type CallPayload = {
  recipientId: string;
  conversationId: string;
};

export type CallAcceptedPayload = {
  callerId: string;
};

export type CallHangUpPayload = {
  receiverId: string;
  callerId: string;
};

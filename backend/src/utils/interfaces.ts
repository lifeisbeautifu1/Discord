import { User } from "@prisma/client";
import { Request } from "express";
import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

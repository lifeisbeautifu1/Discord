import { Injectable } from "@nestjs/common";
import { AuthenticatedSocket } from "src/utils/interfaces";

export interface IGatewaySessionManager {
  getUserSocket(id: string): AuthenticatedSocket | null;
  setUserSocket(id: string, socket: AuthenticatedSocket): void;
  removeUserSocket(id: string): void;
  getSockets(): Map<string, AuthenticatedSocket>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<string, AuthenticatedSocket> = new Map();

  getUserSocket(id: string): AuthenticatedSocket | null {
    return this.sessions.get(id);
  }

  setUserSocket(id: string, socket: AuthenticatedSocket): void {
    this.sessions.set(id, socket);
  }

  removeUserSocket(id: string): void {
    this.sessions.delete(id);
  }

  getSockets(): Map<string, AuthenticatedSocket> {
    return this.sessions;
  }
}

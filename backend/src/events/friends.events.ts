import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Friend } from "@prisma/client";
import { MessagingGateway } from "src/gateway/gateway";
import { GatewaySessionManager } from "src/gateway/gateway.session";
import { ServerEvents } from "src/utils/constants";

@Injectable()
export class FriendsEvents {
  constructor(private readonly gateway: MessagingGateway) {}

  @OnEvent(ServerEvents.FRIEND_REMOVED)
  handleFriendRemoved({ userId, friend }: { userId: string; friend: Friend }) {
    const { senderId, receiverId } = friend;
    console.log(ServerEvents.FRIEND_REMOVED);
    const socket = this.gateway.sessions.getUserSocket(
      receiverId === userId ? senderId : receiverId,
    );
    socket?.emit("onFriendRemoved", friend);
  }
}

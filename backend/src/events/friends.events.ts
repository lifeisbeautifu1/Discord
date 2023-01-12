import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Friend } from "@prisma/client";
import { MessagingGateway } from "src/gateway/gateway";
import { ServerEvents, WebsocketEvents } from "src/utils/constants";

@Injectable()
export class FriendsEvents {
  constructor(
    private readonly gateway: MessagingGateway,
    private readonly event: EventEmitter2,
  ) {}

  @OnEvent(ServerEvents.FRIEND_REMOVED)
  handleFriendRemoved({ userId, friend }: { userId: string; friend: Friend }) {
    const { senderId, receiverId } = friend;
    console.log(ServerEvents.FRIEND_REMOVED);
    const socket = this.gateway.sessions.getUserSocket(
      receiverId === userId ? senderId : receiverId,
    );
    socket?.emit(WebsocketEvents.FRIEND_REMOVED, friend);
    this.event.emit(ServerEvents.NOTIFY_FRIENDS, socket);
    this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, socket);
  }
}

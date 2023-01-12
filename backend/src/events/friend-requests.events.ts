import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Friend, FriendRequest } from "@prisma/client";
import { MessagingGateway } from "src/gateway/gateway";
import { ServerEvents, WebsocketEvents } from "src/utils/constants";

@Injectable()
export class FriendRequestsEvents {
  constructor(
    private readonly gateway: MessagingGateway,
    private readonly event: EventEmitter2,
  ) {}

  @OnEvent(ServerEvents.FRIEND_REQUEST_CREATED)
  friendRequestCreate(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CREATED);
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.receiverId,
    );
    receiverSocket?.emit(WebsocketEvents.FRIEND_REQUEST_RECEIVED, payload);
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_CANCELED)
  handleFriendRequestCancel(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CANCELED);
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.receiverId,
    );
    receiverSocket?.emit(WebsocketEvents.FRIEND_REQUEST_CANCELLED, payload);
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_ACCEPTED)
  handleFriendRequestAccepted(payload: {
    newFriend: Friend;
    friendRequest: FriendRequest;
  }) {
    console.log(ServerEvents.FRIEND_REQUEST_ACCEPTED);
    const senderSocket = this.gateway.sessions.getUserSocket(
      payload.friendRequest.senderId,
    );
    senderSocket?.emit(WebsocketEvents.FRIEND_REQUEST_ACCEPTED, payload);
    this.event.emit(ServerEvents.NOTIFY_FRIENDS, senderSocket);
    this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, senderSocket);
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_REJECTED)
  handleFriendRequestRejected(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_REJECTED);
    const senderSocket = this.gateway.sessions.getUserSocket(payload.senderId);
    senderSocket?.emit(WebsocketEvents.FRIEND_REQUEST_REJECTED, payload);
  }
}

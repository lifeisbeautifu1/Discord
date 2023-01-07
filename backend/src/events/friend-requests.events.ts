import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Friend, FriendRequest } from "@prisma/client";
import { MessagingGateway } from "src/gateway/gateway";
import { ServerEvents, WebsocketEvents } from "src/utils/constants";

@Injectable()
export class FriendRequestsEvents {
  constructor(private readonly gateway: MessagingGateway) {}

  @OnEvent(ServerEvents.FRIEND_REQUEST_CREATE)
  friendRequestCreate(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CREATE);
    const receiverSocket = this.gateway.sessions.getUserSocket(
      payload.receiverId,
    );
    receiverSocket?.emit(WebsocketEvents.FRIEND_REQUEST_RECEIVED, payload);
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_CANCEL)
  handleFriendRequestCancel(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CANCEL);
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
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_REJECTED)
  handleFriendRequestRejected(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_REJECTED);
    const senderSocket = this.gateway.sessions.getUserSocket(payload.senderId);
    senderSocket?.emit(WebsocketEvents.FRIEND_REQUEST_REJECTED, payload);
  }
}

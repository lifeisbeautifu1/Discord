import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { FriendRequest } from "@prisma/client";
import { ServerEvents, WebsocketEvents } from "src/utils/constants";

@Injectable()
export class FriendRequestsEvents {
  constructor() {}

  @OnEvent(ServerEvents.FRIEND_REQUEST_CREATE)
  friendRequestCreate(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CREATE);
    // TODO get socket for the receiver
    // receiverSocket.emit(WebsocketEvents.FRIEND_REQUEST_RECEIVED, payload)
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_CANCEL)
  handleFriendRequestCancel(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_CANCEL);
    // TODO get socket for the receiver
    // receiverSocket.emit(WebsocketEvents.FRIEND_REQUEST_CANCELLED, payload)
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_ACCEPTED)
  handleFriendRequestAccepted() {
    console.log(ServerEvents.FRIEND_REQUEST_ACCEPTED);
    // !TODO get socket for the receiver
    // senderSocket?.emit(WebsocketEvents.FRIEND_REQUEST_ACCEPTED, payload)
  }

  @OnEvent(ServerEvents.FRIEND_REQUEST_REJECTED)
  handleFriendRequestRejected(payload: FriendRequest) {
    console.log(ServerEvents.FRIEND_REQUEST_REJECTED);
    // !TODO get socket for the receiver
    // senderSocket?.emit(WebsocketEvents.FRIEND_REQUEST_REJECTED, payload)
  }
}

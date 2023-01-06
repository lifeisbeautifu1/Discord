import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Friend } from "@prisma/client";
import { ServerEvents } from "src/utils/constants";

@Injectable()
export class FriendsEvents {
  constructor() {}

  @OnEvent(ServerEvents.FRIEND_REMOVED)
  handleFriendRemoved(userId: string, friend: Friend) {
    // const { senderId, receiverId } = friend;
    console.log(ServerEvents.FRIEND_REMOVED);

    // !TODO get socket for the receiver
    // socket?.emit('onFriendRemoved', friend)
  }
}

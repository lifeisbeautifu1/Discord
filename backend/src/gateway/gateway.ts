import { OnEvent } from "@nestjs/event-emitter";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Conversation, Message } from "@prisma/client";
import { Server } from "socket.io";
import { FriendsService } from "src/friends/friends.service";
import {
  ClientEvents,
  ServerEvents,
  WebsocketEvents,
} from "src/utils/constants";
import { AuthenticatedSocket } from "src/utils/interfaces";
import { GatewaySessionManager } from "./gateway.session";

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    readonly sessions: GatewaySessionManager,
    private readonly friendsService: FriendsService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket) {
    console.log("Incoming connection");
    this.sessions.setUserSocket(socket.userId, socket);
    socket.emit("connected", {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log("handleDisconnect");
    this.sessions.removeUserSocket(socket.userId);
  }

  @OnEvent(ServerEvents.CONVERSATION_CREATE)
  handleConversationEvent(payload: Conversation) {
    console.log(ServerEvents.CONVERSATION_CREATE);
    const recipientSocket = this.sessions.getUserSocket(payload.recipientId);
    recipientSocket?.emit(WebsocketEvents.CONVERSATION_CREATED, payload);
    const creatorSocket = this.sessions.getUserSocket(payload.creatorId);
    creatorSocket?.emit(WebsocketEvents.CONVERSATION_CREATED, payload);
  }

  @OnEvent(ServerEvents.MESSAGE_CREATE)
  handleMessageCreate(payload: {
    message: Message;
    conversation: Conversation;
  }) {
    console.log(ServerEvents.MESSAGE_CREATE);
    const { authorId } = payload.message;
    const { creatorId, recipientId } = payload.conversation;
    const authorSocket = this.sessions.getUserSocket(authorId);
    authorSocket?.emit(WebsocketEvents.MESSAGE_CREATED, payload);
    const recipientSocket =
      authorId === creatorId
        ? this.sessions.getUserSocket(recipientId)
        : this.sessions.getUserSocket(creatorId);
    recipientSocket?.emit(WebsocketEvents.MESSAGE_CREATED, payload);
  }

  @SubscribeMessage(ClientEvents.GET_ONLINE_FRIENDS)
  async handleFriendListRetrieve(
    @MessageBody() body: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const { userId } = socket;
    if (userId) {
      const friends = await this.friendsService.getFriends(userId);
      const onlineFriends = friends.filter((friend) =>
        this.sessions.getUserSocket(
          userId === friend.receiverId ? friend.senderId : friend.receiverId,
        ),
      );
      socket.emit(ClientEvents.GET_ONLINE_FRIENDS, onlineFriends);
    }
  }
}

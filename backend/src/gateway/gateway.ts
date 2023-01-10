import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
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
    private readonly event: EventEmitter2,
    private readonly friendsService: FriendsService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: AuthenticatedSocket) {
    console.log("Incoming connection");
    this.sessions.setUserSocket(socket.userId, socket);
    const { userId } = socket;
    if (userId) {
      const friends = await this.friendsService.getFriends(userId);
      friends.forEach((friend) => {
        const friendSocket = this.sessions.getUserSocket(
          userId === friend.receiverId ? friend.senderId : friend.receiverId,
        );
        friendSocket &&
          this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, friendSocket);
      });
    }
    socket.emit("connected", {});
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    console.log("handleDisconnect");
    this.sessions.removeUserSocket(socket.userId);
    const { userId } = socket;
    if (userId) {
      const friends = await this.friendsService.getFriends(userId);
      friends.forEach((friend) => {
        const friendSocket = this.sessions.getUserSocket(
          userId === friend.receiverId ? friend.senderId : friend.receiverId,
        );
        friendSocket &&
          this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, friendSocket);
      });
    }
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

  @OnEvent(ServerEvents.MESSAGE_DELETE)
  handleMessageDelete(payload: {
    conversation: Conversation;
    userId: string;
    messageId: string;
  }) {
    const recipientSocket =
      payload.conversation.creatorId === payload.userId
        ? this.sessions.getUserSocket(payload.conversation.recipientId)
        : this.sessions.getUserSocket(payload.conversation.creatorId);
    recipientSocket?.emit(WebsocketEvents.MESSAGE_DELETE, payload.messageId);
  }

  @OnEvent(ServerEvents.MESSAGE_UPDATE)
  handleMessageUpdate(
    message: Message & {
      conversation: Conversation;
    },
  ) {
    const { authorId, conversation } = message;
    const recipientSocket =
      authorId === conversation.creatorId
        ? this.sessions.getUserSocket(conversation.recipientId)
        : this.sessions.getUserSocket(conversation.creatorId);
    recipientSocket?.emit(WebsocketEvents.MESSAGE_UPDATE, message);
  }

  @OnEvent(ServerEvents.GET_ONLINE_FRIENDS)
  async handleGetOnlineFriends(socket: AuthenticatedSocket) {
    console.log(ServerEvents.GET_ONLINE_FRIENDS);
    const { userId } = socket;
    if (userId) {
      const friends = await this.friendsService.getFriends(userId);
      const onlineFriends = friends.filter((friend) =>
        this.sessions.getUserSocket(
          userId === friend.receiverId ? friend.senderId : friend.receiverId,
        ),
      );
      socket?.emit(ClientEvents.GET_ONLINE_FRIENDS, onlineFriends);
    }
  }

  @SubscribeMessage(ClientEvents.TYPING_START)
  async handleTypingStart(@MessageBody() userId: string) {
    console.log(ClientEvents.TYPING_START);
    const receiverSocket = this.sessions.getUserSocket(userId);
    receiverSocket?.emit(WebsocketEvents.ON_TYPING_START);
  }

  @SubscribeMessage(ClientEvents.TYPING_STOP)
  async handleTypingEnd(@MessageBody() userId: string) {
    console.log(ClientEvents.TYPING_STOP);
    const receiverSocket = this.sessions.getUserSocket(userId);
    receiverSocket?.emit(WebsocketEvents.ON_TYPING_STOP);
  }

  @SubscribeMessage(ClientEvents.GET_ONLINE_FRIENDS)
  async handleFriendListRetrieve(
    @MessageBody() _: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, socket);
  }
}

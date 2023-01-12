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
import { Message } from "@prisma/client";
import { Server } from "socket.io";
import { FriendsService } from "src/friends/friends.service";
import {
  ClientEvents,
  ServerEvents,
  WebsocketEvents,
} from "src/utils/constants";
import {
  AuthenticatedSocket,
  ConversationPopulated,
  TypingPayload,
} from "src/utils/interfaces";
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
    this.event.emit(ServerEvents.NOTIFY_FRIENDS, socket);
    socket.emit("connected", {});
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    console.log("handleDisconnect");
    this.sessions.removeUserSocket(socket.userId);
    this.event.emit(ServerEvents.NOTIFY_FRIENDS, socket);
  }

  @OnEvent(ServerEvents.CONVERSATION_CREATED)
  handleConversationEvent(conversation: ConversationPopulated) {
    console.log(ServerEvents.CONVERSATION_CREATED);
    conversation.participants.forEach((participant) => {
      const socket = this.sessions.getUserSocket(participant.user.id);
      socket?.emit(WebsocketEvents.CONVERSATION_CREATED, conversation);
    });
  }

  @OnEvent(ServerEvents.CONVERSATION_UPDATED)
  handleConversationUpdateEvent(conversation: ConversationPopulated) {
    console.log(ServerEvents.CONVERSATION_UPDATED);
    conversation.participants.forEach((participant) => {
      const socket = this.sessions.getUserSocket(participant.user.id);
      socket?.emit(WebsocketEvents.CONVERSATION_UPDATED, conversation);
    });
  }

  @OnEvent(ServerEvents.MESSAGE_CREATED)
  handleMessageCreate(payload: {
    message: Message;
    conversation: ConversationPopulated;
  }) {
    console.log(ServerEvents.MESSAGE_CREATED);
    const { conversation, message } = payload;
    conversation.participants.forEach((participant) => {
      const socket = this.sessions.getUserSocket(participant.user.id);
      socket?.emit(WebsocketEvents.MESSAGE_CREATED, message);
    });
  }

  @OnEvent(ServerEvents.MESSAGE_DELETED)
  handleMessageDelete(payload: {
    conversation: ConversationPopulated;
    userId: string;
    messageId: string;
  }) {
    console.log(ServerEvents.MESSAGE_DELETED);
    const { conversation, messageId } = payload;
    conversation.participants.forEach((participant) => {
      const socket = this.sessions.getUserSocket(participant.user.id);
      socket?.emit(WebsocketEvents.MESSAGE_DELETED, messageId);
    });
  }

  @OnEvent(ServerEvents.MESSAGE_UPDATED)
  handleMessageUpdate(
    message: Message & {
      conversation: ConversationPopulated;
    },
  ) {
    console.log(ServerEvents.MESSAGE_UPDATED);
    message.conversation.participants.forEach((participant) => {
      const socket = this.sessions.getUserSocket(participant.user.id);
      socket?.emit(WebsocketEvents.MESSAGE_UPDATED, message);
    });
  }

  @OnEvent(ServerEvents.GET_ONLINE_FRIENDS)
  async handleGetOnlineFriends(socket: AuthenticatedSocket) {
    console.log(ServerEvents.GET_ONLINE_FRIENDS);
    if (!socket) return;
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

  @OnEvent(ServerEvents.NOTIFY_FRIENDS)
  async handleNotifyFriends(socket: AuthenticatedSocket) {
    if (!socket) return;
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

  @SubscribeMessage(ClientEvents.CONVERSATION_JOIN)
  onConversationJoin(
    @MessageBody() conversationId: string,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.CONVERSATION_JOIN);
    socket.join(`conversation-${conversationId}`);
  }

  @SubscribeMessage(ClientEvents.CONVERSATION_LEAVE)
  onConversationLeave(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.CONVERSATION_LEAVE);
    client.leave(`conversation-${conversationId}`);
  }

  @SubscribeMessage(ClientEvents.TYPING_START)
  async handleTypingStart(
    @MessageBody() payload: TypingPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.TYPING_START);
    const { conversationId } = payload;
    socket.to(`conversation-${conversationId}`).emit("onTypingStart", payload);
  }

  @SubscribeMessage(ClientEvents.TYPING_STOP)
  async handleTypingEnd(
    @MessageBody() payload: TypingPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.TYPING_STOP);
    const { conversationId } = payload;
    socket.to(`conversation-${conversationId}`).emit("onTypingStop", payload);
  }

  @SubscribeMessage(ClientEvents.GET_ONLINE_FRIENDS)
  async handleFriendListRetrieve(
    @MessageBody() _: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    this.event.emit(ServerEvents.GET_ONLINE_FRIENDS, socket);
  }
}

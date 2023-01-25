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
import { ConversationsService } from "src/conversations/conversations.service";
import { Message, MessageNotification } from "@prisma/client";
import { Server } from "socket.io";
import { FriendsService } from "src/friends/friends.service";
import {
  ClientEvents,
  ServerEvents,
  WebsocketEvents,
} from "src/utils/constants";
import {
  AuthenticatedSocket,
  CallAcceptedPayload,
  CallHangUpPayload,
  CallPayload,
  ConversationPopulated,
  TypingPayload,
} from "src/utils/interfaces";
import { GatewaySessionManager } from "./gateway.session";
import { UserService } from "src/user/user.service";

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
    private readonly userService: UserService,
    private readonly conversationService: ConversationsService,
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

  @OnEvent(ServerEvents.NEW_NOTIFICATIONS)
  hadleNewNotifications(notifications: Array<MessageNotification>) {
    console.log(ServerEvents.NEW_NOTIFICATIONS);
    notifications.forEach((notification) => {
      const socket = this.sessions.getUserSocket(notification.userId);
      socket && socket.emit(WebsocketEvents.NEW_NOTIFICATIONS, notification);
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

  @SubscribeMessage(ClientEvents.VIDEO_CALL_INITIATE)
  async handleVideoCall(
    @MessageBody() data: CallPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VIDEO_CALL_INITIATE);
    const caller = await this.userService.findUserById(socket.userId);
    const receiverSocket = this.sessions.getUserSocket(data.recipientId);
    if (!receiverSocket) {
      socket?.emit(WebsocketEvents.USER_UNAVAILABLE);
      return;
    }
    receiverSocket?.emit(WebsocketEvents.VIDEO_CALL, { ...data, caller });
  }

  @SubscribeMessage(ClientEvents.VIDEO_CALL_ACCEPTED)
  async handleVideoCallAccepted(
    @MessageBody() data: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VIDEO_CALL_ACCEPTED);
    const callerSocket = this.sessions.getUserSocket(data.caller.id);

    const conversation = await this.conversationService.isCreated([
      data.caller.id,
      socket?.userId,
    ]);
    const acceptor = await this.userService.findUserById(socket.userId);

    if (!conversation) return console.log("No conversation found");
    if (callerSocket) {
      const payload = { ...data, conversation, acceptor };
      callerSocket.emit(WebsocketEvents.VIDEO_CALL_ACCEPTED, payload);
      socket.emit(WebsocketEvents.VIDEO_CALL_ACCEPTED, payload);
    }
  }

  @SubscribeMessage(ClientEvents.VIDEO_CALL_REJECTED)
  async handleVideoCallRejected(
    @MessageBody() data: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VIDEO_CALL_REJECTED);
    const receiver = await this.userService.findUserById(socket.userId);
    const callerSocket = this.sessions.getUserSocket(data.caller.id);
    callerSocket &&
      callerSocket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, { receiver });
    socket.emit(WebsocketEvents.VIDEO_CALL_REJECTED, { receiver });
  }

  @SubscribeMessage(ClientEvents.VIDEO_CALL_HANG_UP)
  async handleVideoCallHangUp(
    @MessageBody() { caller, receiver }: CallHangUpPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VIDEO_CALL_HANG_UP);
    if (socket?.userId === caller.id) {
      const receiverSocket = this.sessions.getUserSocket(receiver.id);
      socket.emit(WebsocketEvents.VIDEO_CALL_HANG_UP);
      return (
        receiverSocket &&
        receiverSocket.emit(WebsocketEvents.VIDEO_CALL_HANG_UP)
      );
    }
    socket.emit(WebsocketEvents.VIDEO_CALL_HANG_UP);
    const callerSocket = this.sessions.getUserSocket(caller.id);
    callerSocket && callerSocket.emit(WebsocketEvents.VIDEO_CALL_HANG_UP);
  }

  @SubscribeMessage(ClientEvents.VOICE_CALL_INITIATE)
  async handleVoiceCallInitiate(
    @MessageBody() payload: CallPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const callerId = socket.userId;
    const receiverSocket = this.sessions.getUserSocket(payload.recipientId);
    if (!receiverSocket) socket.emit(WebsocketEvents.USER_UNAVAILABLE);
    receiverSocket.emit(WebsocketEvents.VOICE_CALL, { ...payload, callerId });
  }

  @SubscribeMessage(ClientEvents.VOICE_CALL_ACCEPTED)
  async handleVoiceCallAccepted(
    @MessageBody() payload: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(WebsocketEvents.VOICE_CALL_ACCEPTED);
    const callerSocket = this.sessions.getUserSocket(payload.caller.id);
    const conversation = await this.conversationService.isCreated([
      payload.caller.id,
      socket.userId,
    ]);
    if (!conversation) return console.log("No conversation found");
    if (callerSocket) {
      const acceptor = await this.userService.findUserById(socket.userId);
      const callPayload = { ...payload, conversation, acceptor };
      callerSocket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
      socket.emit(WebsocketEvents.VOICE_CALL_ACCEPTED, callPayload);
    }
  }

  @SubscribeMessage(ClientEvents.VOICE_CALL_HANG_UP)
  async handleVoiceCallHangUp(
    @MessageBody() { caller, receiver }: CallHangUpPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VOICE_CALL_HANG_UP);
    if (socket.userId === caller.id) {
      const receiverSocket = this.sessions.getUserSocket(receiver.id);
      socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
      return (
        receiverSocket &&
        receiverSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP)
      );
    }
    socket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
    const callerSocket = this.sessions.getUserSocket(caller.id);
    callerSocket && callerSocket.emit(WebsocketEvents.VOICE_CALL_HANG_UP);
  }

  @SubscribeMessage(ClientEvents.UPDATE_REMOTE_STREAM)
  async handleUpdateRemoteStream(
    @MessageBody() { caller, receiver }: CallHangUpPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.UPDATE_REMOTE_STREAM);
    if (socket.userId === caller.id) {
      const receiverSocket = this.sessions.getUserSocket(receiver.id);
      return (
        receiverSocket &&
        receiverSocket.emit(WebsocketEvents.UPDATE_REMOTE_STREAM)
      );
    }
    const callerSocket = this.sessions.getUserSocket(caller.id);
    callerSocket && callerSocket.emit(WebsocketEvents.UPDATE_REMOTE_STREAM);
  }

  @SubscribeMessage(ClientEvents.VOICE_CALL_REJECTED)
  async handleVoiceCallRejected(
    @MessageBody() data: CallAcceptedPayload,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log(ClientEvents.VOICE_CALL_REJECTED);
    const receiverId = socket.userId;
    const callerSocket = this.sessions.getUserSocket(data.caller.id);
    callerSocket &&
      callerSocket.emit(WebsocketEvents.VOICE_CALL_REJECTED, { receiverId });
    socket.emit(WebsocketEvents.VOICE_CALL_REJECTED, { receiverId });
  }
}

import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthenticatedSocket } from "src/utils/interfaces";
import { GatewaySessionManager } from "./gateway.session";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly sessions: GatewaySessionManager) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket) {
    console.log("Incoming connection");
    this.sessions.setUserSocket(socket.userId, socket);
    socket.emit("connected", {});
  }

  handleDisconnect(socket: any) {
    console.log("handleDisconnect");
    this.sessions.removeUserSocket(socket.userId);
  }

  // @SubscribeMessage("newMessage")
  // onNewMessage(@MessageBody() body) {
  //   console.log(body);
  //   this.server.emit("onMessage", body);
  // }
}

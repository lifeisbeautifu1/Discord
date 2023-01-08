import { IoAdapter } from "@nestjs/platform-socket.io";
import { AuthenticatedSocket } from "src/utils/interfaces";
import * as cookie from "cookie";
import * as cookieParser from "cookie-parser";
import { redisClient } from "src/main";

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);

    server.use(async (socket: AuthenticatedSocket, next) => {
      console.log("Inside Websocket Adapter");
      const { cookie: clientCookie } = socket.handshake.headers;

      if (!clientCookie) {
        console.log("Client has no cookies");
        return next(new Error("Not Authenticated. No cookies were sent"));
      }

      const { sid } = cookie.parse(clientCookie);

      if (!sid) {
        console.log("no session cookie");
        return next(new Error("Not Authenticated!"));
      }

      const signedCookie = cookieParser.signedCookie(
        sid,
        process.env.SESSION_SECRET,
      );

      if (!signedCookie) return next(new Error("Error signing cookie"));

      const sessionDB = await redisClient.get(`sess:${signedCookie}`);

      if (!sessionDB) return next(new Error("No session found"));

      const userFromJson = JSON.parse(sessionDB);

      if (!userFromJson.passport || !userFromJson.passport.user)
        return next(new Error("Passport or User object does not exist"));

      socket.userId = userFromJson.passport.user;
      next();
    });
    return server;
  }
}

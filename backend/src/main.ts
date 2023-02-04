import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import IoRedis from "ioredis";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as passport from "passport";
import { WebsocketAdapter } from "./gateway/gateway.adapter";

const RedisStore = connectRedis(session);

export const redisClient = new IoRedis("redis://localhost:6379");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const adapter = new WebsocketAdapter(app);

  app.useWebSocketAdapter(adapter);

  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // whiteList: true means remove unnecessary fields from dtos
      whitelist: true,
    }),
  );

  app.use(
    session({
      name: "sid",
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      },
      store: new RedisStore({ client: redisClient }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix("api");

  await app.listen(5000);
}
bootstrap();

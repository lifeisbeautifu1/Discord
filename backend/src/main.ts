import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import IoRedis from "ioredis";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as passport from "passport";

const RedisStore = connectRedis(session);

const redisClient = new IoRedis("redis://localhost:6379");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: "http://localhost:5173",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // whiteList: true means remove unnecessary fields from dtos
      whitelist: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
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

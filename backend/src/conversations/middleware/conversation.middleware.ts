import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "src/utils/interfaces";
import { ConversationsService } from "../conversations.service";

@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(private readonly conversationsService: ConversationsService) {}

  async use(req: AuthenticatedRequest, _: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const isReadable = await this.conversationsService.hasAccess(
      req.params.id,
      userId,
    );
    if (isReadable) next();
    else
      throw new BadRequestException("You have no access to this conversation");
  }
}

import { HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction } from "express";
import { AuthenticatedRequest } from "./interfaces";

export function isAuthorized(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  if (req.user) next();
  else throw new HttpException("Forbidden", HttpStatus.UNAUTHORIZED);
}

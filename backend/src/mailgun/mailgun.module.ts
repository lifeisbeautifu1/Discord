import { Global, Module } from "@nestjs/common";
import { MailgunService } from "./mailgun.service";

@Global()
@Module({
  providers: [MailgunService],
  exports: [MailgunService],
})
export class MailgunModule {}

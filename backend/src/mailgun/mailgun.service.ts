import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import * as mailgun from "mailgun-js";

@Injectable()
export class MailgunService {
  private mg: mailgun.Mailgun;
  constructor(config: ConfigService) {
    this.mg = mailgun({
      apiKey: config.get("MAILGUN_API_KEY"),
      domain: config.get("MAILGUN_DOMAIN"),
    });
  }
  async sendEmailVerification(user: Partial<User>, token: string) {
    const data = {
      from: "noreply@hello.com",
      to: `${user.email}`,
      subject: "Email verification",
      html: `
      <div>
      <h2>Hey, ${user.username}</h2>
          <p>Thanks for registering for an account on Discord! Before we get started, we just need to confirm that this is you. Click below to verify your email address: </p>
          <a href="${
            process.env.CLIENT_URL || "http://localhost:5173"
          }/verify?token=${token}">Verify email</a>
          </p>
        </div>
        `,
    };
    this.mg.messages().send(data, (err, body) => {
      console.log("error: ", err);
      console.log("body: ", body);
    });
  }
  async sendPasswordReset(user: Partial<User>, token: string) {
    const data = {
      from: "noreply@hello.com",
      to: `${user.email}`,
      subject: "Password Reset Request",
      html: `
      <div>
      <h2>Hey, ${user.username}</h2>
          <p>Your Discord password can be reset by clicking the button below. If you did not request a new password, please ignore this email: </p>
          <a href="${
            process.env.CLIENT_URL || "http://localhost:5173"
          }/reset?token=${token}">Reset password</a>
          </p>
        </div>
        `,
    };
    this.mg.messages().send(data, (err, body) => {
      console.log("error: ", err);
      console.log("body: ", body);
    });
  }
}

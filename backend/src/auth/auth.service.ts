import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn() {
    return "I'm sign in!";
  }
  signUp() {
    return "I'm sign up!";
  }
}

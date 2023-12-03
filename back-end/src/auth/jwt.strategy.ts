/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

require('dotenv').config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET
    });
  }

  async validate(payload: any) {
    // payload is the decoded token
    const date = new Date();
    if (payload.exp < date.getTime() / 1000) {
      throw new HttpException(
        'Your session has expired. Please login again.',
        HttpStatus.FORBIDDEN,
      );
    }
    return { id: payload.id, email: payload.email, password: payload.password };
  }
}

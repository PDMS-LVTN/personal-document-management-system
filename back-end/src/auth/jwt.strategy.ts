/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: any) {
    const date = new Date();
    if (payload.exp < date.getTime() / 1000) {
      throw new HttpException(
        'Your session has expired. Please login again.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { id: payload.id, email: payload.email, password: payload.password };
  }
}

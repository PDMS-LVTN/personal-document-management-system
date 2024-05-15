/* eslint-disable prettier/prettier */
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.decorator';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('api/auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() auth) {
    return await this.authService.login(auth.user);
  }

  @Public()
  @Post('loginGoogle')
  async loginGoogle(@Request() auth) {
    const userExists = await this.userService.getUserByEmail({
      email: auth.body.email,
    });
    if (!userExists) {
      return this.userService.createUser({
        email: auth.body.email,
        password: auth.body.password,
        codeEmailConfirmed: 'google',
      });
    }
    return await this.authService.login(userExists);
  }
}

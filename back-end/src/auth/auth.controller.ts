/* eslint-disable prettier/prettier */
import { Controller, Request, Post, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.decorator';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('api/auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  // @Public()
  // @Post('/login')
  // async login(@Request() req) {
  //   return await this.authService.login(req.user);
  // }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(
    @Request() auth,
    @Response({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(auth.user, response);
  }
  // async login(@Request() auth) {
  //   return await this.authService.login(auth.user);
  // }

  @Public()
  @Post('loginGoogle')
  async loginGoogle(
    @Request() auth,
    @Response({ passthrough: true }) response: Response,
  ) {
    const userExists = await this.userService.getUserByEmail({
      email: auth.body.email,
    });
    if (!userExists) {
      return this.userService.createUser({
        email: auth.body.email,
        password: auth.body.password,
      });
    }
    return await this.authService.login(userExists, response);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}

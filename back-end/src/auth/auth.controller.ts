import { Controller, Request, Post, UseGuards, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './auth.decorator';
import { RefreshJwtAuthGuard } from './refresh-jwt-auth.guard';

@ApiTags('auth')
@Controller('api/auth/')
export class AuthController {
  constructor(private authService: AuthService) { }

  // @UseGuards(LocalAuthGuard)
  // @Public()
  // @Post('/login')
  // async login(@Request() req) {
  //   return await this.authService.login(req.user);
  // }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() auth, @Response({ passthrough: true }) response: Response) {
    return await this.authService.login(auth.user, response);
  }
  // async login(@Request() auth) {
  //   return await this.authService.login(auth.user);
  // }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail({ email });
    if (!user) {
      throw new NotAcceptableException('Email is not exist');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email, password: user.password };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.userRepository.update(user.id, {
      refresh_token: refresh_token,
    });
    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(user: any) {
    const payload = { id: user.id, email: user.email, password: user.password };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}

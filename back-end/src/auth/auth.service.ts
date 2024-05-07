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
    const user = await this.userService.getUserByEmail({ email: email });
    if (!user) {
      throw new NotAcceptableException('Email is not exist');
    }
    if (!user.isEmailConfirmed) {
      throw new NotAcceptableException('Email is not verified');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new NotAcceptableException('Password is not correct');
    }
    return user;
  }

  async login(user: User) {
    const payload = { id: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      id: user.id,
      access_token,
    };
  }
}

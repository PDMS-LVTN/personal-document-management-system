import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Equal, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly MailerService: MailerService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(createUserDto: CreateUserDto) {
    // Check if user exists
    console.log('sign_up');
    const userExists = await this.getUserByEmail({
      email: createUserDto.email,
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    //Hash password
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    createUserDto.codeEmailConfirmed = await bcrypt.hash(
      Math.floor(Math.random() * 10000).toString(),
      saltOrRounds,
    );
    const res = await this.MailerService.sendEmail({
      recipients: [
        {
          name: createUserDto.email,
          address: createUserDto.email,
        },
      ],
      subject: '[SelfNote] Confirm E-mail Address',
      html: `<div><p>Thanks for signing up with SelfNote!</p>

      <p>You must follow this link to activate your account:</p>
      <a href="${process.env.CLIENT_URL}/login?email=${createUserDto.email}&codeEmailConfirmed=${createUserDto.codeEmailConfirmed}">${process.env.CLIENT_URL}/login?email=${createUserDto.email}&codeEmailConfirmed=${createUserDto.codeEmailConfirmed}</a>

      <p>Don't hesitate to contact us with your feedback.</p></div>`,
    });
    console.log(res);
    //Create user
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findOneUser(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async getUserByEmail(req: any) {
    const user = await this.userRepository.findOne({
      where: { email: Equal(req.email) },
    });
    return user;
  }

  async verifyEmail(req: any) {
    const codeEmailConfirmed = req.codeEmailConfirmed;
    if (!codeEmailConfirmed) {
      throw new NotAcceptableException('CodeEmailConfirm is not found');
    }

    const user = await this.userRepository.findOne({
      where: { email: Equal(req.email) },
    });
    if (
      user.isEmailConfirmed ||
      codeEmailConfirmed == user.codeEmailConfirmed
    ) {
      user.isEmailConfirmed = true;
      user.codeEmailConfirmed = null;
      await this.userRepository.save(user);
      return true;
    } else {
      throw new NotAcceptableException(
        'Email verification failed, invalid code!',
      );
    }
  }

  async forgotPassword(req: any) {
    const user = await this.userRepository.findOne({
      where: { email: Equal(req.email) },
    });
    if (!user) {
      throw new NotAcceptableException('User not found');
    }
    const saltOrRounds = 10;
    const resetPasswordToken = await bcrypt.hash(
      Math.floor(Math.random() * 10000).toString(),
      saltOrRounds,
    );
    user.resetPasswordToken = resetPasswordToken;
    await this.userRepository.save(user);
    const res = await this.MailerService.sendEmail({
      recipients: [
        {
          name: user.email,
          address: user.email,
        },
      ],
      subject: '[SelfNote] Reset your password',
      html: `<div></div><p>You're receiving this e-mail because you or someone else has requested a password reset for your user account at .</p>

      <p>Click the link below to reset your password:</p>
      <a href="${process.env.CLIENT_URL}/reset-password?email=${user.email}&resetPasswordToken=${resetPasswordToken}">${process.env.CLIENT_URL}/reset-password?email=${user.email}&resetPasswordToken=${resetPasswordToken}</a>

      <p>If you did not request a password reset you can safely ignore this email.</p></div>`,
    });
    return true;
  }

  async resetPassword(req: any) {
    const resetPasswordToken = req.resetPasswordToken;
    if (!resetPasswordToken) {
      throw new NotAcceptableException('ResetPasswordToken is not found');
    }
    const user = await this.userRepository.findOne({
      where: { email: Equal(req.email) },
    });
    if (!user) {
      throw new NotAcceptableException('User not found');
    }
    console.log(resetPasswordToken, user.resetPasswordToken);
    if (resetPasswordToken == user.resetPasswordToken) {
      user.resetPasswordToken = null;
      user.password = await bcrypt.hash(req.password, 10);
      await this.userRepository.save(user);
      return true;
    } else {
      throw new NotAcceptableException('Reset password failed, invalid token!');
    }
  }
}

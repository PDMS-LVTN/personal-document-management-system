import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(createUserDto: CreateUserDto) {
    // Check if user exists
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

    //Create user
    const newUser = this.userRepository.create({
      ...createUserDto,
      refresh_token: 'refresh-token',
    });
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
      where: { email: req.email },
    });
    return user;
  }
}

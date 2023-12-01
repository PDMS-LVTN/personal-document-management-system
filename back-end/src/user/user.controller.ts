import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/auth.decorator';
import { User } from './entities/user.entity';
// import { AuthenticateUserDto } from './dto/authenticate-user.dto';

@ApiTags('user')
@Controller('api/user/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('sign_up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @Post()
  // async logOutUser(@Req() req, @Res() res) {
  //   return this.userService.logOutUser(req, res);
  // }

  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.userService.findOneUser(id);
  }

  @Post('get_by_email')
  async getUserByEmail(
    @Body() req: { email: string },
  ): Promise<User | undefined> {
    console.log(req.email);
    return this.userService.getUserByEmail({ email: req.email });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}

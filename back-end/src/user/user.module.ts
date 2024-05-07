import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Note } from '../note/entities/note.entity';
import { MailerModule } from '../mailer/mailer.module';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note])],
  controllers: [UserController],
  providers: [UserService, MailerService],
})
export class UserModule {}

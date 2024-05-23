import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ImageContentModule } from './image_content/image_content.module';
// import { SearchModule } from './search/search.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from './file_upload/file_upload.module';
import { NoteCollaboratorModule } from './note_collaborator/note_collaborator.module';
import { PublicCollaboratorModule } from './public_collaborator/public_collaborator.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forRoot(configService.dataSourceOptions()),
    UserModule,
    TagModule,
    NoteModule,
    AuthModule,
    ImageContentModule,
    FileUploadModule,
    // SearchModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/image_content'),
    }),
    NoteCollaboratorModule,
    PublicCollaboratorModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }

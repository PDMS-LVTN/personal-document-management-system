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
import { PinnedNoteModule } from './pinned_note/pinned_note.module';
import { FavoriteNoteModule } from './favorite_note/favorite_note.module';
import { RecentNoteModule } from './recent_note/recent_note.module';
import { ImageContentModule } from './image_content/image_content.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forRoot(configService.dataSourceOptions()),
    UserModule,
    TagModule,
    NoteModule,
    AuthModule,
    PinnedNoteModule,
    FavoriteNoteModule,
    RecentNoteModule,
    ImageContentModule,
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
export class AppModule {}

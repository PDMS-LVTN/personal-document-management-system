import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './mailer.interface';
import { Public } from '../auth/auth.decorator';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Public()
  @Post('send_email')
  async sendEmail() {
    const dto: SendEmailDto = {
      from: {
        name: 'SelfNote Application',
        address: 'selfnoteapplication@gmail.com',
      },
      recipients: [
        {
          name: 'Test',
          address: '',
        },
      ],
      subject: '',
      html: '',
    };
    return await this.mailerService.sendEmail(dto);
  }
}

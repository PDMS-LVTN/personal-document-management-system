import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './mailer.interface';

@Injectable()
export class MailerService {
  mailTransport() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const { from, recipients, subject, html, text, placeholderReplacements } =
      dto;
    const transporter = this.mailTransport();
    const options = {
      from: from ?? {
        name: process.env.APP_NAME,
        address: process.env.DEFAULT_MAIL_FROM,
      },
      to: recipients,
      subject,
      html,
      text,
    };
    try {
      const result = await transporter.sendMail(options);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

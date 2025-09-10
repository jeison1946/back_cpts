import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface Mail {
  email: string;
  subject: string;
  template_id: string;
  context?: object;
  attachments?: any[];
  cc?: string | string[];
  bcc?: string | string[];
}
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  send(build: Mail) {
    this.mailerService
      .sendMail({
        to: build.email,
        from: process.env.SMTP_FROM,
        subject: build.subject,
        template: `./${build.template_id}`,
        context: build.context ?? {},
        attachments: build.attachments ?? [],
        cc: build.cc ?? [],
        bcc: build.bcc ?? [],
      })
      .catch((e) => {
        console.log(`[response error] - Service [Email] - [detail] ${e}`);
      });
  }
}

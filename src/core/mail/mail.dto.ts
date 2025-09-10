import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class MailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template_id: string;

  @IsNotEmpty()
  context: object;

  @IsOptional()
  attachments: [];
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class NodemailerService {
  private readonly logger = new Logger(NodemailerService.name);
  private transporter: nodemailer.Transporter;
  private readonly templateDir: string;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.templateDir = this.resolveTemplateDir();
  }

  private initializeTransporter() {
    const mailConfig = {
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    };

    this.transporter = nodemailer.createTransport(mailConfig);

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('SMTP connection error', error);
      } else {
        this.logger.log('SMTP server ready');
      }
    });
  }

  private resolveTemplateDir(): string {
    const possiblePaths = [
      path.join(__dirname, '..', '..', 'templates'),
      path.join(__dirname, '..', 'templates'),
      path.join(process.cwd(), 'templates'),
    ];

    for (const possiblePath of possiblePaths) {
      try {
        fs.accessSync(path.join(possiblePath, 'otp.template.hbs'));
        return possiblePath;
      } catch (err) {
        continue;
      }
    }
    throw new Error('Email template directory not found');
  }

  async send(email: string, otp: string): Promise<void> {
    try {
      // Load and compile template
      const templatePath = path.join(this.templateDir, 'otp.template.hbs');
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      const html = template({ otp });

      const mailOptions = {
        from: `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_ADDRESS')}>`,
        to: email,
        subject: 'Your OTP Code',
        html,
        text: `Your OTP code is: ${otp}`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent to ${email}`, info.messageId);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${email}`, error.stack);
      throw new Error('Failed to send OTP email');
    }
  }
}
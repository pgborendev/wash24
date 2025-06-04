import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { GaxiosError } from 'gaxios';
import * as fs from 'fs';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private jwtClient: Auth.JWT;
  private gmail: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeGmail();
  }

  private async initializeGmail() {
    try {
       const serviceAccountPath = this.configService.get('GOOGLE_SERVICE_ACCOUNT_PATH');
      if (!serviceAccountPath) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_PATH environment variable is not set');
      }
      // Read and parse the service account file
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Fix newlines in private key if needed
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      if (!serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error('Missing Google service account configuration');
      }

      this.jwtClient = new google.auth.JWT({
        email: serviceAccount.client_email,
        key: serviceAccount.private_key,
        scopes: ['https://www.googleapis.com/auth/gmail.send'],
        subject: this.configService.get('GOOGLE_SERVICE_ACCOUNT_IMPERSONATE_EMAIL'),
      });

      // Verify auth works during initialization
      await this.refreshToken();
      this.gmail = google.gmail({ version: 'v1', auth: this.jwtClient });
      
      this.logger.log('Gmail service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Gmail service', error.stack);
      throw new Error('Failed to initialize email service');
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const token = await this.jwtClient.authorize();
    
      this.logger.debug('Gmail auth token refreshed');
    } catch (error) {
      this.logger.error('Failed to refresh Gmail auth token', error.stack);
      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      // Always refresh credentials before sending email
      await this.refreshToken();

      const message = [
        `To: ${email}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: Your Wash24 OTP Code`,
        '',
        `Your OTP code is: ${otp}`,
        '',
        `This code will expire in 10 minutes.`,
      ].join('\r\n');  // Using \r\n for SMTP compliance

      const encoded = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encoded },
      });

      this.logger.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error.stack);
      
      if (error instanceof GaxiosError) {
        this.logger.error(`Gmail API error details: ${JSON.stringify(error.response?.data)}`);
      }

      throw new Error('Failed to send OTP email. Please try again later.');
    }
  }
}
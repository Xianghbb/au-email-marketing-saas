import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  campaignId?: number;
  organizationId?: string;
}

export async function sendEmail(options: EmailOptions): Promise<string> {
  const params = {
    Source: options.from,
    Destination: {
      ToAddresses: [options.to],
    },
    Message: {
      Subject: {
        Data: options.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: options.html,
          Charset: 'UTF-8',
        },
        Text: options.text ? {
          Data: options.text,
          Charset: 'UTF-8',
        } : undefined,
      },
    },
    Tags: [
      {
        Name: 'campaign-id',
        Value: options.campaignId?.toString() || 'unknown',
      },
      {
        Name: 'organization-id',
        Value: options.organizationId || 'unknown',
      },
    ],
  };

  const command = new SendEmailCommand(params);
  const response = await sesClient.send(command);

  return response.MessageId || 'unknown';
}
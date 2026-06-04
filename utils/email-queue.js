const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION });
const EMAIL_QUEUE_URL = process.env.EMAIL_QUEUE_URL;

async function enqueueEmail(payload) {
  if (!EMAIL_QUEUE_URL) {
    console.warn("EMAIL_QUEUE_URL is not configured. Skipping email enqueue.");
    return;
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: EMAIL_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

module.exports = { enqueueEmail };

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION });
const ALUMNI_CONVERSION_QUEUE_URL = process.env.ALUMNI_CONVERSION_QUEUE_URL;

async function enqueueAlumniConversion(payload) {
  if (!ALUMNI_CONVERSION_QUEUE_URL) {
    throw new Error("ALUMNI_CONVERSION_QUEUE_URL is not configured");
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: ALUMNI_CONVERSION_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

module.exports = { enqueueAlumniConversion };

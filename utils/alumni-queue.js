const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION });
const ALUMNI_CONVERSION_QUEUE_URL = process.env.ALUMNI_CONVERSION_QUEUE_URL;

async function enqueueAlumniConversion(payload) {
  if (!ALUMNI_CONVERSION_QUEUE_URL) {
    console.warn("ALUMNI_CONVERSION_QUEUE_URL is not configured. Skipping alumni conversion enqueue.");
    return;
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: ALUMNI_CONVERSION_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

module.exports = { enqueueAlumniConversion };
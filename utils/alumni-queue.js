const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION });
const ALUMNI_CONVERSION_QUEUE_URL = process.env.ALUMNI_CONVERSION_QUEUE_URL;
const ALUMNI_REVERT_QUEUE_URL = process.env.ALUMNI_REVERT_QUEUE_URL;

async function enqueueAlumniConversion(payload) {
  if (!ALUMNI_CONVERSION_QUEUE_URL) {
    throw new Error("ALUMNI_CONVERSION_QUEUE_URL is not configured");
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: ALUMNI_CONVERSION_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

async function enqueueAlumniRevert(payload) {
  if (!ALUMNI_REVERT_QUEUE_URL) {
    throw new Error("ALUMNI_REVERT_QUEUE_URL is not configured");
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: ALUMNI_REVERT_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

module.exports = { enqueueAlumniConversion, enqueueAlumniRevert };

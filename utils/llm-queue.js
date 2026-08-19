const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.REGION });
const CRAP_LLM_QUEUE_URL = process.env.CRAP_LLM_QUEUE_URL;

async function enqueueLlmJob(payload) {
  if (!CRAP_LLM_QUEUE_URL) {
    console.warn("CRAP_LLM_QUEUE_URL is not configured. Skipping LLM job enqueue.");
    return;
  }

  await sqs.send(new SendMessageCommand({
    QueueUrl: CRAP_LLM_QUEUE_URL,
    MessageBody: JSON.stringify(payload),
  }));
}

module.exports = { enqueueLlmJob };

/**
 * LLM abstraction layer.
 * Provider-agnostic wrapper around chat-completion APIs (DeepSeek / OpenAI).
 * The provider and API key are configured via env vars so swapping
 * providers does not require changes across the codebase.
 */

const LLM_BASE_URL = process.env.LLM_BASE_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_MODEL = process.env.LLM_MODEL;
const LLM_TIMEOUT_MS = parseInt(process.env.LLM_TIMEOUT_MS || '100000', 10);

function _getRequestPayload(messages, model) {
	return JSON.stringify({
		model: model || LLM_MODEL,
		thinking: { type: 'disabled' },
		// reasoning_effort: "low", // if thinking is enabled
		messages,
		response_format: { type: 'json_object' },
		max_tokens: 8000,
	});
}

async function callLlm({ messages, model } = {}) {
	if (!LLM_API_KEY) {
		const err = new Error('LLM_API_KEY is not configured');
		err.statusCode = 500;
		throw err;
	}

	const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${LLM_API_KEY}`,
		},
		body: _getRequestPayload(messages, model),
		signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
	});

	if (!response.ok) {
		const text = await response.text().catch(() => '');
		const err = new Error(
			`LLM API error: ${response.status} ${text || response.statusText}`,
		);
		err.statusCode =
			response.status >= 400 && response.status < 500 ? 400 : 502;
		err.llmStatus = response.status;
		throw err;
	}

	const data = await response.json();
	const content = data?.choices?.[0]?.message?.content;
	if (!content) {
		const err = new Error('LLM returned an empty response');
		err.statusCode = 502;
		throw err;
	}
	return content;
}

/**
 * Both exercise and path generation now send a single user message — the
 * admin's stored prompt (with course/year/cgpa placeholders already
 * substituted by the caller). No system prompt: the admin's prompt text is
 * responsible for specifying the desired JSON output shape.
 */
async function generateExercise(prompt) {
	if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
		throw new Error('prompt is required');
	}

	const content = await callLlm({
		messages: [{ role: 'user', content: prompt }],
	});

	return JSON.parse(content);
}

async function generatePathComparison(prompt) {
	if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
		throw new Error('prompt is required');
	}

	const content = await callLlm({
		messages: [{ role: 'user', content: prompt }],
	});

	return JSON.parse(content);
}

module.exports = {
	callLlm,
	generateExercise,
	generatePathComparison,
};

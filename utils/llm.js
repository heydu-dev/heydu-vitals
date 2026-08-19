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

const QUESTIONS_SYSTEM_PROMPT =
	'You are an education AI that generates multiple-choice quiz questions.' +
	' Given a topic prompt, generate exactly 5-7 MCQ questions.' +
	' Each question must have exactly 4 options (an array of 4 strings)' +
	' and exactly one correct answer from those options.' +
	' Return ONLY a JSON object in this exact format, no extra text:' +
	' {"questions": [{"question": "string", "options": ["a","b","c","d"], "correctAnswer": "string", "difficulty": "Easy|Medium|Hard"}]}';

const PATH_SYSTEM_PROMPT =
	"You are a career guidance AI. Given a person's answers to career assessment questions," +
	' generate a comparison of "Your Path" (what the person did)' +
	' vs "Priya\'s Path" (the ideal recommended path).' +
	' Each path should have exactly 5 distinct points.' +
	' Return ONLY a JSON object in this exact format, no extra text:' +
	' {"yourPath": [{"point": "string", "explanation": "string"}], "priyasPath": [{"point": "string", "explanation": "string"}]}';

async function generateQuestions(prompt) {
	if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
		throw new Error('prompt is required');
	}

	const content = await callLlm({
		messages: [
			{ role: 'system', content: QUESTIONS_SYSTEM_PROMPT },
			{ role: 'user', content: prompt },
		],
	});

	const parsed = JSON.parse(content);

	if (!parsed.questions || !Array.isArray(parsed.questions)) {
		throw new Error('LLM response missing "questions" array');
	}

	if (parsed.questions.length < 5 || parsed.questions.length > 7) {
		throw new Error(
			`LLM returned ${parsed.questions.length} questions, expected 5-7`,
		);
	}

	return parsed;
}

async function generatePath(prompt, questions, selectedAnswers) {
	if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
		throw new Error('prompt is required');
	}

	const userContent = JSON.stringify(
		{ prompt, questions, selectedAnswers },
		null,
		2,
	);

	const content = await callLlm({
		messages: [
			{ role: 'system', content: PATH_SYSTEM_PROMPT },
			{ role: 'user', content: userContent },
		],
	});

	const parsed = JSON.parse(content);

	if (
		!parsed.yourPath ||
		!Array.isArray(parsed.yourPath) ||
		!parsed.priyasPath ||
		!Array.isArray(parsed.priyasPath)
	) {
		throw new Error(
			'LLM response missing "yourPath" or "priyasPath" arrays',
		);
	}

	return parsed;
}

module.exports = {
	callLlm,
	generateQuestions,
	generatePath,
};

/**
 * Normalize email values from spreadsheets (Excel hyperlinks often store `mailto:user@x.com`).
 * Strips a leading `mailto:` (case-insensitive), trims, lowercases.
 */
function normalizeEmailFromExcel(raw) {
	let s = String(raw == null ? '' : raw).trim();
	if (s.toLowerCase().startsWith('mailto:')) {
		s = s.slice('mailto:'.length).trim();
	}
	return s.toLowerCase();
}

module.exports = { normalizeEmailFromExcel };

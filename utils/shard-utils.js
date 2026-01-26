/**
 * Sharding utilities
 *
 * Goal:
 * - Deterministically convert an ID (userID / institutionID) into a shard number.
 * - Keep shard counts different per use-case:
 *   - Followers fanout: 1024 shards (high cardinality / high write/read volume)
 *   - Institution fanout: 8 shards (lower cardinality)
 * - Support shard "versioning" for followers so we can re-shard later without breaking old keys.
 *
 * Notes:
 * - The shardVersion is NOT derived here (it should come from caller/config).
 * - shardNumber is derived deterministically from the ID and maxShards.
 */

const MAX_FOLLOWER_SHARDS = 2048;
const MAX_INSTITUTION_SHARDS = 16;

// NOTE: Institutions/college/student/staff use normal (non-versioned) sharding.

/**
 * Hash to a deterministic unsigned 32-bit integer.
 *
 * Why SHA256?
 * - Deterministic across runtimes
 * - No bitwise ops (eslint `no-bitwise` is enabled in this repo)
 * @param {string} input
 * @returns {number} Unsigned 32-bit integer (0..2^32-1)
 */
function hash32(input) {
	// Using first 8 hex chars (32 bits) is enough for stable sharding.
	// parseInt(..., 16) avoids any bitwise operations.
	// eslint-disable-next-line global-require
	const crypto = require('crypto');
	const hex = crypto
		.createHash('sha256')
		.update(input)
		.digest('hex')
		.slice(0, 8);
	return parseInt(hex, 16);
}

/**
 * Deterministically map an ID to a shard number in the range [0, maxShards-1].
 * @param {string|number} id
 * @param {number} maxShards
 * @returns {number}
 */
function getShardNumber(id, maxShards) {
	if (maxShards <= 0) throw new Error('maxShards must be > 0');
	if (id === undefined || id === null)
		throw new Error('id is required to compute shardNumber');
	const str = String(id);
	if (!str) throw new Error('id must be a non-empty string/number');
	return hash32(str) % maxShards;
}

module.exports = {
	MAX_FOLLOWER_SHARDS,
	MAX_INSTITUTION_SHARDS,
	hash32,
	getShardNumber,
};

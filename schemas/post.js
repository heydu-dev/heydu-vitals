// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');
const roleUUIDSchema = Joi.string().guid();

const PostSchema = Joi.object({
	description: Joi.string().max(300).allow('').allow(null),
	media: Joi.array()
		.items({
			key: Joi.string()
				.guid({ version: ['uuidv5', 'uuidv7'] })
				.required(),
			rootFolder: Joi.string().valid('posts').required(),
			type: Joi.string().valid('video', 'image').required(),
		})
		.default([])
		.required(),
	circleType: Joi.string().required(),
	postUserID: Joi.string().optional(), // Derived from the authenticated profile.
	postUserTypeID: Joi.number().optional(),
	postUserEmail: Joi.string().email().optional(),
	postUserRoleIDs: Joi.array().items(roleUUIDSchema).unique().max(50).optional(),
	institutionID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	specialisationID: Joi.string().optional(),
	batchID: Joi.string().optional(),
	departmentID: Joi.string().optional(),
});

const EditPostSchema = Joi.object({
	description: Joi.string().max(300).allow('').allow(null),
	media: Joi.array()
		.items({
			key: Joi.string()
				.guid({ version: ['uuidv5', 'uuidv7'] })
				.required(),
			rootFolder: Joi.string().valid('posts').required(),
			type: Joi.string().valid('video', 'image').required(),
		})
		.default([]),
	isHidden: Joi.boolean().optional(),
});

const DeletePostSchema = Joi.object({});

const GetPutObjectSignedUrlSchema = Joi.object({
	keys: Joi.array()
		.items(
			Joi.object({
				institutionID: Joi.string().required(),
				profileTypeID: Joi.number().valid(0, 1, 2, 3).required(),
				profileEmail: Joi.string().email().required(),
				key: Joi.string()
					.guid({ version: ['uuidv5', 'uuidv7'] })
					.required(),
			}),
		)
		.required()
		.min(1),
});

const GetPostSchema = Joi.object({
	profileUserID: Joi.string().guid({ version: ['uuidv5', 'uuidv7'] }),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
	everyoneLastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
	followersLastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
	forClasses: Joi.boolean().optional(),
	isFollowing: Joi.boolean(),
	toFollowers: Joi.boolean(),
	departmentID: Joi.string().optional(),
	specialisationID: Joi.string().optional(),
	batchID: Joi.string().optional(),
	institutionID: Joi.string(),
});

const GetProfilePostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	viewProfileUserID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const LikePostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	likedBy: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
});

const GetLikedPostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const SavePostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	savedBy: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
});

const GetSavedPostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const PinPostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	pinnedBy: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
});

const GetPinnedPostSchema = Joi.object({
	institutionID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const CommentSchema = Joi.object({
	description: Joi.string().max(300),
	postID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.required(),
	commentingProfileUserID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.optional(), // Derived from the authenticated profile.
	commentingProfileTypeID: Joi.number().optional(),
	commentingProfileRoleIDs: Joi.array().items(roleUUIDSchema).unique().max(50).optional(),
	parentCommentID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.optional(),
});

const UpdateCommentSchema = Joi.object({
	description: Joi.string().max(300),
});

const GetCommentsSchema = Joi.object({
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
	parentCommentID: Joi.string()
		.guid({ version: ['uuidv5', 'uuidv7'] })
		.optional(),
});

module.exports = {
	PostSchema,
	EditPostSchema,
	DeletePostSchema,
	GetPutObjectSignedUrlSchema,
	GetPostSchema,
	GetProfilePostSchema,
	LikePostSchema,
	GetLikedPostSchema,
	SavePostSchema,
	GetSavedPostSchema,
	PinPostSchema,
	GetPinnedPostSchema,
	CommentSchema,
	GetCommentsSchema,
	UpdateCommentSchema,
};

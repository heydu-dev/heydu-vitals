// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require('joi');

const PostSchema = Joi.object({
	description: Joi.string().max(300).allow('').allow(null),
	media: Joi.array()
		.items({
			key: Joi.string()
				.guid({ version: ['uuidv4', 'uuidv5'] })
				.required(),
			rootFolder: Joi.string().valid('posts').required(),
			type: Joi.string().valid('video', 'image').required(),
		})
		.default([])
		.required(),
	circleType: Joi.string().required(),
	postUserID: Joi.string().required(), // User ID of the person who created the post: Joi.number().valid(0, 1, 2, 3).required(),
	postUserTypeID: Joi.number().required(),
	postUserEmail: Joi.string().email().required(),
	postUserRoleID: Joi.number().required(),
	institutionID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	specialisationID: Joi.string()
		.when('specialisationYear', {
			is: Joi.exist(),
			then: Joi.string().allow('*').required().allow(null),
		})
		.optional(),
	specialisationYear: Joi.string().optional(),
});

const EditPostSchema = Joi.object({
	description: Joi.string().max(300).allow('').allow(null),
	media: Joi.array()
		.items({
			key: Joi.string()
				.guid({ version: ['uuidv4', 'uuidv5'] })
				.required(),
			rootFolder: Joi.string().valid('posts').required(),
			type: Joi.string().valid('video', 'image').required(),
		})
		.default([]),
	isHidden: Joi.boolean().optional(),
});

const DeletePostSchema = Joi.object({
	deletedByUserRoleID: Joi.number().required(),
});

const GetPutObjectSignedUrlSchema = Joi.object({
	keys: Joi.array()
		.items(
			Joi.object({
				institutionID: Joi.string().required(),
				profileTypeID: Joi.number().valid(0, 1, 2, 3).required(),
				profileEmail: Joi.string().email().required(),
				key: Joi.string()
					.guid({ version: ['uuidv4', 'uuidv5'] })
					.required(),
			}),
		)
		.required()
		.min(1),
});

const GetPostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
	isFollowing: Joi.boolean(),
	toFollowers: Joi.boolean(),
	specialisationID: Joi.string()
		.allow('*')
		.when('specialisationYear', {
			is: Joi.exist(),
			then: Joi.string().allow('*').required(),
		}),
	specialisationYear: Joi.string().allow('*'),
	institutionID: Joi.string(),
});

const GetProfilePostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	viewProfileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const LikePostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	likedBy: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
});

const GetLikedPostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const SavePostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	savedBy: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
});

const GetSavedPostSchema = Joi.object({
	profileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	limit: Joi.number().required().max(10),
	lastEvaluatedKey: Joi.alternatives().try(
		Joi.object().unknown(true),
		Joi.allow(null),
	),
});

const PinPostSchema = Joi.object({
	postID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	pinnedBy: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
});

const GetPinnedPostSchema = Joi.object({
	institutionID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
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
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	commentingProfileUserID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
		.required(),
	commentingProfileTypeID: Joi.number().required(),
	commentingProfileRoleID: Joi.number().required(),
	parentCommentID: Joi.string()
		.guid({ version: ['uuidv4', 'uuidv5'] })
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
		.guid({ version: ['uuidv4', 'uuidv5'] })
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

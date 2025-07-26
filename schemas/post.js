// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

const PostSchema = Joi.object({
    description: Joi.string().max(300).allow("").allow(null),
    media: Joi.array().items({
        key: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
        rootFolder: Joi.string().valid("posts").required(),
        type: Joi.string().valid("video", "image").required(),
    }).default([]).required(),
    circleType: Joi.string().required(),
    postUserID: Joi.string().required(), // User ID of the person who created the post: Joi.number().valid(0, 1, 2, 3).required(),
    postUserTypeID: Joi.number().required(),
    postUserEmail: Joi.string().email().required(),
    postUserRoleID: Joi.number().required(),
    institutionID: Joi.number().required(),
    specialisationID: Joi.string().allow("*").when("specialisationYear", {
        is: Joi.exist(),
        then: Joi.string().allow("*").required().allow(null),
    }),
    specialisationYear: Joi.string().allow(null),
});

const EditPostSchema = Joi.object({
    id: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
    description: Joi.string().max(300).allow("").allow(null),
    media: Joi.array().items({
        key: Joi.string().guid({ version: ["uuidv4", "uuidv5"] }).required(),
        rootFolder: Joi.string().valid("posts").required(),
        type: Joi.string().valid("video", "image").required(),
    }).default([]),
    isHidden: Joi.boolean().optional(),
});

module.exports = {
    PostSchema,
    EditPostSchema,
};

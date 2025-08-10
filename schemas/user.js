const Joi = require("joi");

module.exports = {
    StaffSchema: Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().trim().required(),
        profileImageBinary: Joi.string().trim().allow(null).allow(""),
        designation: Joi.string().trim().required(),
        roleID: Joi.number().required(),
        institutionID: Joi.string().required(),
        departmentID: Joi.string().required(),
        specializationID: Joi.string().allow(null).allow(""),
        gender: Joi.string().trim().required(),
    }),

    EditStaffSchema: Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().trim().required(),
        profileImageBinary: Joi.string().trim().required(),
        designation: Joi.string().trim().required(),
        roleID: Joi.number().required(),
    }),

    StudentSchema: Joi.object({
        name: Joi.string().required(),
        startYear: Joi.date().iso().required(),
        finalYear: Joi.date().iso().min(Joi.ref("start_year")).required(),
        email: Joi.string().email().required(),
        degreeID: Joi.number().required(),
        departmentID: Joi.number().required(),
        specializationID: Joi.number().required(),
        institutionID: Joi.number().required(),
        registrationNumber: Joi.string()
            .pattern(/^[a-zA-Z0-9_.-]+$/) // Alphanumeric, underscore, dash, dot
            .required(),
        isAlumni: Joi.boolean()
    }),

    EditStudentSchema: Joi.object({
        name: Joi.string(),
        alternateEmail: Joi.string(),
        phone: Joi.string(),
        stateID: Joi.string(),
        countryCode: Joi.string()
    }),

    FollowerSchema: Joi.object({
        followingID: Joi.string().required(), // ID of the user being followed (if applicable)
        followingProfileTypeID: Joi.string().required(), // Profile type of the user being followed (if applicable)
        followerID: Joi.string().required(), // ID of the user following (if applicable)
        followerProfileTypeID: Joi.string().required(), // Pr
    }),

    GetFollowersSchema: Joi.object({
        followingID: Joi.string().required(), // ID of the user being followed (if applicable)
        limit: Joi.number().required(),
        offset: Joi.number().required()
    }),

    GetFollowingSchema: Joi.object({
        followerID: Joi.string().required(), // ID of the user being followed (if applicable)
        limit: Joi.number().required(),
        offset: Joi.number().required()
    })
};
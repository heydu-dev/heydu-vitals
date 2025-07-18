// eslint-disable-next-line import/no-extraneous-dependencies
const Joi = require("joi");

const DepartmentSchema = Joi.object({
    name: Joi.string().trim().required(),
    institutionID: Joi.number().required()
});

const EditDepartmentSchema = Joi.object({
    name: Joi.string().trim().required(),
});

const SpecialisationSchema = Joi.object({
    name: Joi.string().trim().required(),
    departmentID: Joi.number().required(),
    degreeID: Joi.number().required(),
    institutionID: Joi.number().required()
});

const EditSpecialisationSchema = Joi.object({
    name: Joi.string().trim().required(),
});


module.exports = {
    DepartmentSchema,
    EditDepartmentSchema,
    SpecialisationSchema,
    EditSpecialisationSchema
};

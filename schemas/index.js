const { InstitutionSchema, UpdateInstitutionSchema } = require('./profile');
const { OTPSchema, ValidateOTPSchema } = require('./otp');
const { DegreeSchema, InstitutionTypeSchema, ProfileTypeSchema, RoleSchema, CountrySchema } = require('./utility');

module.exports = {
    InstitutionSchema,
    UpdateInstitutionSchema,
    OTPSchema,
    ValidateOTPSchema,
    DegreeSchema,
    InstitutionTypeSchema,
    ProfileTypeSchema,
    RoleSchema,
    CountrySchema,
};

const { InstitutionSchema, UpdateInstitutionSchema } = require('./profile');
const { OTPSchema, ValidateOTPSchema } = require('./otp');
const { DegreeSchema, InstitutionTypeSchema, ProfileTypeSchema, RoleSchema, CountrySchema } = require('./utility');
const { StaffSchema, EditStaffSchema, StudentSchema, EditStudentSchema, FollowerSchema, GetFollowersSchema } = require('./user');
const { DepartmentSchema, EditDepartmentSchema, SpecialisationSchema, EditSpecialisationSchema } = require("./batch")

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
    StaffSchema,
    EditStaffSchema,
    StudentSchema,
    EditStudentSchema,
    FollowerSchema,
    GetFollowersSchema,
    DepartmentSchema,
    EditDepartmentSchema,
    SpecialisationSchema,
    EditSpecialisationSchema
};

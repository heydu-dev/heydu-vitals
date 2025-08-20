const { InstitutionSchema, UpdateInstitutionSchema } = require('./profile');
const { OTPSchema, ValidateOTPSchema } = require('./otp');
const {
	DegreeSchema,
	InstitutionTypeSchema,
	ProfileTypeSchema,
	RoleSchema,
	CountrySchema,
} = require('./utility');
const {
	StaffSchema,
	EditStaffSchema,
	StudentSchema,
	EditStudentSchema,
	FollowerSchema,
	GetFollowersSchema,
} = require('./user');
const { DepartmentSchema, SpecialisationSchema } = require('./batch');
const {
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
} = require('./post');

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
	SpecialisationSchema,
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
};

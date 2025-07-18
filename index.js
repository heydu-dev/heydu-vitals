// Export all schemas
const schemas = require('./schemas');

// Export all utilities
const utils = require('./utils');

// Export template
const otpTemplate = require('./templates/otp-template.ejs');

// Main exports
module.exports = {
    // Schemas
    ...schemas,

    // Utils
    ...utils,

    // Templates
    otpTemplate,

    // Individual exports for backward compatibility
    schemas,
    utils,
};

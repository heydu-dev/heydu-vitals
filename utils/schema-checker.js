/* eslint-disable import/no-extraneous-dependencies */

module.exports = {
    schemaCheck(schema, json) {
        const schemaValidation = schema.validate(json);
        return schemaValidation;
    },
};

module.exports = {
    ErrorHandler: (err, req, res, next) => {
        const msg = `\n--------------------------------\npath: ${req.originalUrl}
        \nbody: ${JSON.stringify(req?.body || {})}\n
        methods: ${JSON.stringify(req?.route?.methods || {})}\n
        ${err.stack}\n--------------------------------`;
        console.log(msg);
        res.status(err.status || 500).json({
            success: false,
            status: err.statusCode || 500,
            message: err.message || "Something went wrong, please try again later",
            stack: ["dev", "local"].includes(process.env.NODE_ENV) ? err.stack : {},
        });
    },
};

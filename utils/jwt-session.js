/* eslint-disable default-case */
const jwt = require("jsonwebtoken");
const { userAction } = require("data-wolf");

function skippingRoutes() {
    const SKIP_ROUTES = new Map();
    SKIP_ROUTES.set("/auth/send-otp");
    SKIP_ROUTES.set("/auth/register");
    SKIP_ROUTES.set("/auth/validate-otp");
    SKIP_ROUTES.set("/auth/logout");
    // SKIP_ROUTES.set("/api/admin/auth/send-otp");
    // SKIP_ROUTES.set("/api/admin/auth/validate-otp");
    SKIP_ROUTES.set("/utility/degrees");
    SKIP_ROUTES.set("/utility/get-states");
    // SKIP_ROUTES.set("/api/region/get-countries");
    SKIP_ROUTES.set("/utility/get-visible-countries");
    SKIP_ROUTES.set("/profile/list-universities");
    SKIP_ROUTES.set("/utility/institution-types");
    return SKIP_ROUTES;
}

// eslint-disable-next-line consistent-return
function statusBasedResponse(status, res, next) {
    switch (status) {
        case "deleted":
            return res.status(400).json({
                message: "Your profile is deleted, please contact support for further details",
            });
        case "rejected":
            return res.status(400).json({
                message: "Your profile is rejected, please contact support for further details",
            });
        case "pending":
            return res.status(400).json({
                message: "Your profile is pending for approval, please wait for sometime",
            });
        case "approved":
            next();
    }
}

module.exports = {
    generateJWT(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
    },

    authenticateJWT(req, res, next) {
        if (skippingRoutes().has(req.path)) {
            return next();
        }
        const token = req.headers.authorization;
        console.log(token);
        if (!token) { return res.status(401).json({ message: "Authentication failed: Please login to access the apis" }); }

        return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            console.log(err)
            if (err) { return res.status(403).json({ message: "Request is forbidden" }); }
            userAction.getByEmail(user.email)
                .then((profile) => {
                    if (profile.length === 0) {
                        return res.status(404).json({
                            message: "User not registered with Heydu, please check",
                        });
                    }
                    if ((profile[0]?.profileTypeID == 0 || profile[0]?.profileTypeID == 1)
                        && ["rejected", "deleted", "pending"].includes(profile[0]?.status)) {
                        return statusBasedResponse(profile[0]?.status, res, next);
                    }
                    next();
                }).catch((err) => {
                    console.log(err);
                    res.status(500).json({ message: "Something went wrong" });
                });
        });
    },
};

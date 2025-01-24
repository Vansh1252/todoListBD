const constants = {
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },
    RESPONSE_MESSAGES: {
        SUCCESS: "Operation successful.",
        USER_CREATED: "User created successfully.",
        BAD_REQUEST: "Invalid input data.",
        SERVER_ERROR: "Internal server error.",

    },
    ROLES: {
        ADMIN: "admin",
        USER: "user",
    }
};

module.exports = constants;
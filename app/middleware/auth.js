const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const auth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(StatusCodes.OK).json({
            status: 0,
            error: {
                fields: {
                    token: 'REQUIRED',
                },
                code: 'FORMAT_ERROR',
            },
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            status: 0,
            error: {
                fields: {
                    token: 'NOT_VALID',
                },
                code: 'AUTHENTICATION_FAILED',
            },
        });
    }
}

module.exports = auth;

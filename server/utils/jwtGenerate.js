const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerate(user_id) {
    const payload = {
        user:  user_id
    }

    return jwt.sign(payload, `${process.env.JWT_SECRET_KEY}`, {expiresIn: "1h"})
}

module.exports = jwtGenerate;
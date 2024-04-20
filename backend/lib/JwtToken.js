import jwt from "jsonwebtoken";
const jwtsecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const createEmailVerificationToken = async (userId) => {
    const token = await jwt.sign({ _id: userId, email: true }, jwtsecret, {
        expiresIn: "5m",
    });
    return token;
};

export const createAccessToken = async (userId) => {
    const token = await jwt.sign({ _id: userId }, jwtsecret, {
        expiresIn: "1d",
    });
    return token;
};

export const createRefreshToken = async (userId) => {
    const token = await jwt.sign({ _id: userId }, jwtRefreshSecret, {
        expiresIn: "30d",
    });
    return token;
};

export const getTokenData = async (token) => {
    const userId = await jwt.verify(token, jwtsecret);
    return userId;
};

export const getRefreshTokenData = async (token) => {
    const userId = await jwt.verify(token, jwtRefreshSecret);
    return userId;
};

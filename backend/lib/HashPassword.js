import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../constants/constants.js";

const saltRounds = SALT_ROUNDS;
const addedSaltRounds = 4;
export const HashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const addedSalt = await bcrypt.genSalt(addedSaltRounds);
    const saltedPassword = password + addedSalt;
    const hashedPassword = await bcrypt.hash(saltedPassword, salt);
    const pattern = process.env.SALT_PATTERN;
    return hashedPassword + pattern + addedSalt;
};

export const VerifyPassword = async (password, hash) => {
    const pattern = process.env.SALT_PATTERN;
    const strings = hash.split(pattern);
    const newHash = strings[0];
    const addedSalt = strings[1];
    const passwordMatch = await bcrypt.compare(password + addedSalt, newHash);
    return passwordMatch;
};

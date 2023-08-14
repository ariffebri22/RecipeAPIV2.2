const argon2 = require("argon2");

const hashPassword = {
    hash: async (password) => {
        try {
            const hashedPassword = await argon2.hash(password);
            return hashedPassword;
        } catch (error) {
            console.error("Error hashing password:", error.message);
            throw new Error("Error hashing password");
        }
    },

    verify: async (hashedPassword, inputPassword) => {
        try {
            const match = await argon2.verify(hashedPassword, inputPassword);
            return match;
        } catch (error) {
            console.error("Error verifying password:", error.message);
            throw new Error("Error verifying password");
        }
    },
};

module.exports = hashPassword;

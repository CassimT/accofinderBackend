import bcrypt from "bcrypt"
export const hashPassword = async (password) => {
    const saltRounds = 10
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
};

export const comparePassword = async (raw, hashed) => {
    try {
        return await bcrypt.compare(raw, hashed);
    } catch (error) {
        console.error("Error comparing passwords:", error);
        throw error;
    }
};

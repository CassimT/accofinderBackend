import express from "express";
import passport from "passport";
import "../stratagies/localStratagy.mjs"
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();
const jwtSecret = "admin-1"; 

// Endpoint for user login
router.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user;

    const token = jsonwebtoken.sign(
        { id: user._id, role: user.role },
        jwtSecret,
        { expiresIn: "1h" }
    );
    return res.status(201).json({
        msg: "success!",
        user: { id: user._id, role: user.role },
        token
    });
});

// Endpoint for checking if the user is authenticated
router.get("/api/auth/check", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    return res.status(200).json({ user: req.user });
});

// Endpoint for logging out
router.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Error logging out" });
        res.status(200).json({ msg: "Logged out successfully" });
    });
});

// Endpoint for retrieving user profile based on token
router.get("/api/auth/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.status(200).json({ user: req.user });
});

// Endpoint for refreshing access token
router.post("/api/auth/refresh-token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "Token missing" });

    try {
        const payload = jsonwebtoken.verify(token, jwtSecret, { ignoreExpiration: true });
        const newToken = jsonwebtoken.sign(
            { id: payload.id, role: payload.role },
            jwtSecret,
            { expiresIn: "1h" }
        );
        res.status(200).json({ token: newToken });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Invalid token" });
    }
});

// Endpoint for changing user password
router.put("/api/auth/change-password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

        user.password = newPassword;
        await user.save();
        res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error changing password" });
    }
});

// Endpoint for resetting password
router.post("/api/auth/reset-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const resetToken = jsonwebtoken.sign(
            { id: user._id },
            jwtSecret,
            { expiresIn: "15m" }
        );

        // Here, send the resetToken to the user via email.
        res.status(200).json({ msg: "Password reset link sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing password reset" });
    }
});

export default router;

import express, { Router } from "express";
import userDataValidation from "../validationSchemas/userDataValidation.mjs";
import { User } from "../dbSchemas/userSchema.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";
const router = Router();

// Endpoint for registering a new user (student or agent)
router.post("/api/users/register", checkSchema(userDataValidation), async (request, response) => {
    const results = validationResult(request);
    if (!results.isEmpty()) return response.status(400).send({ error: results.array() });

    const data = matchedData(request);
    const newUser = new User(data);
    newUser.password = await hashPassword(data.password);
    newUser.role = newUser.role.toLowerCase();

    try {
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(`Error registering user: ${error}`);
        return response.sendStatus(500);
    }
});

// Endpoint for retrieving user profile by ID
router.get("/api/users/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id).select("-password");
        if (!user) return response.status(404).send({ error: "User not found" });
        return response.status(200).send(user);
    } catch (error) {
        console.log(`Error fetching user profile: ${error}`);
        return response.sendStatus(500);
    }
});

// Endpoint for updating user profile by ID
router.put("/api/users/:id", checkSchema(userDataValidation), async (request, response) => {
    const results = validationResult(request);
    if (!results.isEmpty()) return response.status(400).send({ error: results.array() });

    const data = matchedData(request);

    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, data, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) return response.status(404).send({ error: "User not found" });
        return response.status(200).send(updatedUser);
    } catch (error) {
        console.log(`Error updating user profile: ${error}`);
        return response.sendStatus(500);
    }
});

// Endpoint for deleting user account by ID
router.delete("/api/users/:id", async (request, response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(request.params.id);
        if (!deletedUser) return response.status(404).send({ error: "User not found" });
        return response.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.log(`Error deleting user: ${error}`);
        return response.sendStatus(500);
    }
});

// Endpoint for checking user role by ID
router.get("/api/users/role/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id).select("role");
        if (!user) return response.status(404).send({ error: "User not found" });
        return response.status(200).send({ role: user.role });
    } catch (error) {
        console.log(`Error fetching user role: ${error}`);
        return response.sendStatus(500);
    }
});
//sammary
router.get("/api/user-summary/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("bookings listings");
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const summary = {
        viewers: Math.floor(Math.random() * 100), // Placeholder
        totalPosted: user.listings.length,
        booked: user.bookings.length,
        revenue: user.listings.length * 100, // Placeholder revenue calculation
      };
  
      res.json(summary);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  

export default router;

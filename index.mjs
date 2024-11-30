import express, { json } from "express";
import routerIndex from "./src/routes/routerIndex.mjs";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import setVisitedMiddleware from "./src/middlewares/setVisitedMiddleware.mjs";
import { Listing } from "./src/dbSchemas/listingSchama.mjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Environment Variables
const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

// Database Connection
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to accofinder Database");

    // Check and drop index on startup
    Listing.collection.indexExists("agent_1").then((exists) => {
      if (exists) {
        Listing.collection.dropIndex("agent_1", (err, result) => {
          if (err) {
            console.error("Error dropping index:", err);
          } else {
            console.log("Index dropped successfully:", result);
          }
        });
      } else {
        console.log("Index does not exist.");
      }
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });

// Middleware Order Matters!
// Session and Passport Setup
app.use(
  session({
    secret: "accomodation-finder",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 120000 }, // 2 minutes
  })
);

// Add middleware that relies on the session here
app.use(passport.initialize());
app.use(passport.session());
app.use(setVisitedMiddleware); // Now `req.session` is initialized
app.use(json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Routes
app.use(routerIndex);

// Main Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from Vercel!" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express, { json } from "express";
import routerIndex from "../src/routes/routerIndex.mjs";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import setVisitedMiddleware from "../src/middlewares/setVisitedMiddleware.mjs";
import { Listings } from "../src/dbSchemas/listingSchama.mjs";

// Initialize the app
const app = express();

const dbUrl = "mongodb+srv://bedcom2422:9HWIcSeM7AyppOJE@cluster0.ckivv.mongodb.net/accofinder?retryWrites=true&w=majority";
const connectionParameters = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose
  .connect(dbUrl, connectionParameters())
  .then(() => {
    console.log('Connected to accofinder Database');

    // Drop the index only once on startup (if it exists)
    Listings.collection.indexExists('agent_1')
      .then((exists) => {
        if (exists) {
          Listings.collection.dropIndex('agent_1', (err, result) => {
            if (err) {
              console.error('Error dropping index:', err);
            } else {
              console.log('Index dropped successfully:', result);
            }
          });
        } else {
          console.log('Index does not exist.');
        }
      })
      .catch((err) => {
        console.error('Error checking index existence:', err);
      });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });


// Middleware setup
app.use(json());
app.use(cors());

// Session and passport setup
app.use(session({
  secret: "mySecret",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 2,
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));

// Apply routes after session and passport middleware
app.use(routerIndex);
app.use(setVisitedMiddleware);

// Main route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

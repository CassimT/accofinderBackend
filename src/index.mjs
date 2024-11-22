import express, { json } from "express";
import routerIndex from "./routes/routerIndex.mjs";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import setVisitedMiddleware from "./middlewares/setVisitedMiddleware.mjs";
import { Listings } from "./dbSchemas/listingSchama.mjs";

// Initialize the app
const app = express();

// Database connection
mongoose
  .connect("mongodb://localhost/accofinder")
  .then(() => {
    console.log(`Connected to accofinder Database`);
    // Drop the index only once on startup (if it exists)
    Listings.collection.indexExists('agent_1')
      .then((exists) => {
        if (exists) {
          Listings.collection.dropIndex('agent_1', function (err, result) {
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
    console.log(`Error: ${error}`);
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
app.get("/", (req, res) => {
  res.send({ msg: "Hello Programmers" });
});

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Connected at port: ${PORT}`);
});

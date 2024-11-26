import { Router } from "express";
import { validationResult, matchedData, checkSchema } from "express-validator";
import listingDataValidation from "../validationSchemas/listingDataValidation.mjs";
import { Listings } from "../dbSchemas/listingSchama.mjs";
import { upload } from "../utils/multerConfig.mjs";

const router = Router();

// Endpoint for creating listing
router.post("/api/listings", 
  upload.fields([
    { name: "roomimage", maxCount: 1 },
    { name: "toiletimage", maxCount: 1 },
    { name: "kitchenimage", maxCount: 1 },
    { name: "outsideviewimage", maxCount: 1 }
  ]), 
  checkSchema(listingDataValidation), 
  async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) 
        return res.status(400).json({ error: results.array() });
    
    const data = matchedData(req);

    // Store file information in the data object
    data.roomimage = req.files.roomimage ? {
      path: req.files.roomimage[0].path, 
      contentType: req.files.roomimage[0].mimetype, 
    } : null;

    const newListing = new Listings(data);
    try {
      const savedListing = await newListing.save();
      return res.status(200).json(savedListing);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
});

// Endpoint for retrieving all listings
router.get("/api/listings", async (req, res) => {
  try {
    const listings = await Listings.find();
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching listings" });
  }
});

// Endpoint for getting listing by ID
router.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listings.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving listing" });
  }
});

// Endpoint for updating listing by ID
router.put("/api/listings/:id", upload.none(),  async (req, res) => {
  const {params:{id},body} = req
  console.log(body)
  try {
    const updatedListing = await Listings.findByIdAndUpdate(id, body, { new: true });
    if (!updatedListing) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating listing" });
  }
});

// Endpoint for deleting listing by ID
router.delete("/api/listings/:id", async (req, res) => {
  try {
    const deletedListing = await Listings.findByIdAndDelete(req.params.id);
    if (!deletedListing) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting listing" });
  }
});

// Endpoint for searching by hostel name
router.get("/api/listings/search", async (req, res) => {
  const { name } = req.query; // Extract 'name' from the query string
  if (!name) {
    return res.status(400).json({ error: "Name parameter is required" });
  }
  try {
    // Perform case-insensitive search on the 'hostelname' field
    const listings = await Listings.find({ hostelname: new RegExp(name, "i") }); 
    res.status(200).json(listings); // Return matched listings
  } catch (error) {
    console.error("Error searching listings:", error);
    res.status(500).json({ error: "Error searching listings" });
  }
});

// Endpoint for filtering by agent
router.get("/api/listings/agent/:agentname", async (req, res) => {
  try {
    const listings = await Listings.find({ agentName: req.params.agentname });
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching listings by agent" });
  }
});

// Endpoint for filtering by room status
router.get("/api/listings/status/:roomstatus", async (req, res) => {
  try {
    const listings = await Listings.find({ status: req.params.roomstatus });
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching listings by status" });
  }
});

// Endpoint for top-rated listings
router.get("/api/listings/top-rated", async (req, res) => {
  try {
    const listings = await Listings.find().sort({ rating: -1 }).limit(10);
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching top-rated listings" });
  }
});

// Endpoint for filtering by room type
router.get("/api/listings/type/:roomtype", async (req, res) => {
  try {
    const listings = await Listings.find({ roomType: req.params.roomtype });
    res.status(200).json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching listings by room type" });
  }
});

export default router;

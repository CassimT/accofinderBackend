import serverless from "serverless-http";
import app from "../src/index.mjs"; // Adjust the path if needed

export const handler = serverless(app);

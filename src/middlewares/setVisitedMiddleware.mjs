// setVisitedMiddleware.mjs

const setVisitedMiddleware = (req, res, next) => {
  // Ensure session is initialized
  if (!req.session) {
    return next(new Error('Session not initialized'));
  }

  // Check if the 'visited' flag exists in the session
  if (!req.session.visited) {
    req.session.visited = true;
    console.log("User is visiting for the first time!");
    console.log(req.sessionID);  // Logging session ID
  } else {
    console.log("User has visited before.");
  }

  next(); // Proceed to the next middleware or route handler
};

export default setVisitedMiddleware;

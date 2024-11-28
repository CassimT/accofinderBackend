// setVisitedMiddleware.mjs

const setVisitedMiddleware = (req, res, next) => {
  // Ensure session is initialized
  if (!req.session) {
    return next(new Error('Session not initialized'));
  }
  if (!req.session.visited) {
    req.session.visited = true;
    console.log("User is visiting for the first time!");
    console.log(req.sessionID);  
  } else {
    console.log("User has visited before.");
  }

  next(); 
};

export default setVisitedMiddleware;

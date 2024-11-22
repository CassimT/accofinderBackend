
const setVisitedMiddleware = (req, res, next) => {
    if (!req.session.visited) {
      req.session.visited = true;
      console.log("User is visiting for the first time!");
      console.log(req.sessionID);
    }
    next();
  };
  
 export default setVisitedMiddleware
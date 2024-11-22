import { Listings } from "../dbSchemas/listingSchama.mjs";

export const getID = (request,response,next)=>{
    const {param:{id}} = request;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)) 
        return response.sendStatus(400)
    const findUser = Listings.find((user)=>user.id === parsedId);
    if(!findUser)
        return response.sendStatus(404);

    request.findUserId = findUser;
    next();
}

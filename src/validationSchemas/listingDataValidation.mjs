import mongoose from "mongoose";

const listingDataValidation = {
    hostelname: {
        isString: { 
         errorMessage: "hostelname must be a string" 
      },
        notEmpty: { 
         errorMessage: "hostelname cannot be empty"
       }
    },
    price: {
        isString: { 
         errorMessage: "price must be a string" 
      },
        notEmpty: { 
         errorMessage: "price cannot be empty" 
      }
    },
    roomtype: {
        isString: { 
         errorMessage: "roomtype must be a string" 
      },
        notEmpty: { 
         errorMessage: "roomtype cannot be empty" 
      }
    },
    available: {
        isBoolean: { 
         errorMessage: "available must be a Boolean" 
      },
        notEmpty: {
          errorMessage: "available cannot be empty" 
         }
    },
    rating: {   
        isInt: { 
          options: { min: 0, max: 5 },
         errorMessage: "rating must be a decimal" 
      },
        notEmpty: { 
         errorMessage: "rating cannot be empty" 
      }
    },
    review: {
        isString: {
          errorMessage: "review must be a string" 
         },
        
    },
    description: {
        isString: {
          errorMessage: "description must be a string" 
         },
        notEmpty: { 
         errorMessage: "description cannot be empty" 
      }
    },
    agent: {    
        custom: {
            options: (value) => mongoose.Types.ObjectId.isValid(value),
            errorMessage: "agent must be a valid ObjectId",
        },
        notEmpty: { errorMessage: "agent cannot be empty" }
    },
    agentphone: {
        isString: { 
         errorMessage: "agentphone must be a string"
       },
        notEmpty: { 
         errorMessage: "agentphone cannot be empty" 
      },
        isLength: {
            options: { min: 10, max: 14 },
            errorMessage: "Invalid phone number length"
        }
    },
    email: {
        isString: { 
         errorMessage: "email must be a string" 
      },
        notEmpty: {
         errorMessage: "email cannot be empty" 
      }
    },
    roomimage: {
        custom: {
            options: (value, { req }) => {
                if (!req.files.roomimage || req.files.roomimage.length === 0) {
                    throw new Error("roomimage is required");
                }
                return true;
            }
        }
    },
    location: {
        isString: { errorMessage: "location must be a string" },
        notEmpty: { errorMessage: "location cannot be empty" }
    },
    distance: {
        isString: { errorMessage: "distance must be a string" },
        notEmpty: { errorMessage: "distance cannot be empty" }
    }
}

export default listingDataValidation;

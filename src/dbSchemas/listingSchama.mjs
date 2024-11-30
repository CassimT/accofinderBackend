import mongoose from "mongoose";

const listingSchama = new mongoose.Schema({
    hostelname: {
      type:mongoose.Schema.Types.String,
      unique:true,
      required:true  
    },
    price:{
        type:mongoose.Schema.Types.String,
        required:true
    },
    roomtype:{
        type: mongoose.Schema.Types.String,
        required: true

    },
    available:{
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    rating:{
        type: mongoose.Schema.Types.Number
    },
    review:{
        type: mongoose.Schema.Types.String

    },
    description: {
        type: mongoose.Schema.Types.String

    },
    //phone,email,name and all aget/ladload details
    agent: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: false, 
      },
    //to be removed in future version
    agentphone: {
        type: mongoose.Schema.Types.Number

    },
    //to be removen in future version
   
    //to be removed in future version
    email: {
        type: mongoose.Schema.Types.String

    },
    roomimage:{
        path: String,
       
    },
    location: {
        type: mongoose.Schema.Types.String
    },
    distance: {
        type: mongoose.Schema.Types.Number
    }

},{timestamps: true})

export const Listing = mongoose.model("Listing",listingSchama)
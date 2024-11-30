// user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { 
    type: String,
     required: true
  },
  lastname: { 
    type: String,
     required: true
  },
  username: { 
    type: String,
     required: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String,
     required: true 
    },
  role: { 
    type: String,
     enum: ['student', 'agent', 'student-agent'], 
     required: true 
    },
  bookings: [
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Listing'
     }
    ],
  listings: [
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Listing' 
    }
]
}, { timestamps: true });

// Virtuals for role checks
userSchema.virtual('isStudent').get(function() {
  return this.role === 'student' || this.role === 'student-agent';
});

userSchema.virtual('isAgent').get(function() {
  return this.role === 'agent' || this.role === 'student-agent';
});

// Method to calculate total listings for an agent
userSchema.methods.totalListings = async function() {
  if (!this.isAgent) {
    throw new Error('Only agents have listings.');
  }
  const count = await mongoose.model('Listing').countDocuments({ agent: this._id });
  return count;
};
//other methodes

export const User = mongoose.model("User", userSchema);

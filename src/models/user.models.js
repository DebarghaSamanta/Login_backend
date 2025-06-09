import mongoose ,{Schema} from "mongoose"

const userSchema = new Schema({
    fullname:{
        type: String,
        required: true,
        trim:true,
        index:true
    },
    phoneNumber:{
        type: Number,
        required: true,
        unique: true
    },
    emailId: {
    type: String,
    required: true,
    unique: true
    },
    adharNo: {
        type: Number,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true,"password is required"] // should be hashed before saving
    },
    govtIdProof: {
        type: String, // URL to the uploaded ID proof
        required: true
    },
    photo: {
        type: String, // URL to the uploaded photo cloudinary
        required: true
    },
    department: {
        type: String,
        enum: ["Logistics and Supply","Operations Planning","Intelligence and Situation Monitoring Cell","Driver"],
        required: true
    },
    refreshToken:{
        require:true
    },
    vehicleType: {
    type: String,
    required: function() {
      return this.department === "Driver";
    }
  },
  vehicleNumber: {
    type: String,
    required: function() {
      return this.department === "Driver";
    }
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.department === "Driver";
    }
  },
  licenseDocument: {
    type: String, // URL
    required: function() {
      return this.department === "Driver";
    }
  },
  availabilityStatus: {
    type: Boolean,
    default: true,
    required: function() {
      return this.department === "Driver";
    }
  },

},{timestamps:true})
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const USer = mongoose.model("User",userSchema)
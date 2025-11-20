import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            default : "customer"
        },
        isBlocked : {
            type : Boolean,
            default : false
        },
        iaEmailVerified : {
            type : Boolean,
            default : false
        },
        image : {
            type : String,
            default : "/default_user.jpg"
        }

    }
)

const User = mongoose.model("User",userSchema)    //mongoose.model(collection name,data structure) 

export default User
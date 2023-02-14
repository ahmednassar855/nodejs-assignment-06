import  mongoose  from 'mongoose';

const userSchema =  mongoose.Schema({
    name :String,
    email : String,
    age: Number,
    password : String,
    user_type: {
        type: String,
        enum : ['user','productOwner' , 'admin' ],
        default: 'user'
    }},{timestamps : true })
export const userModel = mongoose.model('user' , userSchema)
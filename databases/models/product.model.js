import  mongoose  from 'mongoose';

const productSchema =  mongoose.Schema({
    name :String,
    description : String,
    price: Number,
    stock : Number,
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref : 'user',
    }

    }
    ,{timestamps : true ,})
export const productModel = mongoose.model('product' , productSchema)
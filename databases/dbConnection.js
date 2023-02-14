import mongoose from "mongoose";

export function dbConnection() {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/assignment_06').then(() => {
        console.log('Data Base Is Connected Successfully');
    }).catch((err) => {
        console.log('Data Base Is Not Connected');
    })
}
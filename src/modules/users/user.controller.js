import { userModel } from "../../../databases/models/user.model.js";
import bcrypt from "bcrypt";
import { json } from 'express';

//  add user // check if email is exist or not for validation // hash pw 
const emailIsExist = async (email) => {
    let checkEmailIfExist = await userModel.findOne({ email });
    return checkEmailIfExist;
}

const checkEmailAndIdIsExist = async (_id, email) => {
    let userCheck = await userModel.findOne({ _id, email });
    console.log(userCheck, "ssssssssssssss");
    return userCheck;
}
const userIsAdmin = async (_id) => {
    let checkUserIsAdmin = await userModel.findOne({ _id, user_type: "admin" })
    return checkUserIsAdmin;
}

const userIsProductOwner = async (email) => {
    let checkUserIsAdmin = await userModel.findOne({ email, user_type: "productOwner" }, { age: 0, password: 0 })
    console.log(checkUserIsAdmin);
    if (checkUserIsAdmin != null) {
        return checkUserIsAdmin;
    } else {
        return false;
    }
}

// sign up
const addUser = async (req, res) => {
    const { name, email, password, age } = req.body;
    let checkEmailIfExist = await emailIsExist(email);
    if (checkEmailIfExist == null) {
        bcrypt.hash(password, 10, async function (err, hash) {
            let addNewUser = await userModel.insertMany({ name, email, age, password: hash })
            res.json({ message: " add user successfully", addNewUser })
        });
    } else {
        res.json({ message: " This Email is already reserved", email })
    }
}

// singn in  >> post method take two inputs password , email
const singin = async (req, res) => {
    const { email, password } = req.body;
    let signedInUser = await emailIsExist(email)
    if (signedInUser) {
        const match = await bcrypt.compare(password, signedInUser.password);
        if (match) {
            res.json({ message: "Sing in success , Welcome", match })
        } else {
            res.json({ message: "Incorrect password , please try again" })
        }
    } else {
        res.json({ message: "This email is not registerd yet....." })
    }
}

// delete user  >> post user take two inputs email , emailtoDelete  >> email authorize admin only to delete any other emails
const deleteUser = async (req, res) => {
    const { email, emailToDelete } = req.body;
    let checkUser = await userModel.findOne({ email, user_type: "admin" }, { _id: 0, age: 0, password: 0 });
    if (checkUser == null) {
        res.json({ message: "You ar not authorized to delete user!!!", checkUser })
    } else {
        let userToDelete = await userModel.findOneAndDelete({ email: emailToDelete } , {projection:{ _id: 0, age: 0, password: 0 }});
        if (userToDelete == null) {
            res.json({ message: "Thsi email is not found", userToDelete })
        } else {
            res.json({ message: "user deletd successfuully", userToDelete })
        }

    }
}

// update user by same user >> put method and take four inputs _id, email, name, age and can change name , age only
const updateUser = async (req, res) => {
    const { _id, email, name, age } = req.body;
    let userChecked = await checkEmailAndIdIsExist(_id, email);
    console.log(userChecked);
    if (userChecked) {
        let updateTheUser = await userModel.findOneAndUpdate({ email }, { name, age }, { new: true, projection: { _id: 0, email: 0, user_type: 0, password: 0 } });
        res.json({ message: "updated sucessfullyy", updateTheUser })
    } else {
        res.json({ message: "error id with this email is not exist!!!!" })
    }
}

// update user-type by admin only >> put method take three inputs  _id, email, user_type > and admin can change userType only
const updateUserType = async (req, res) => {
    const { _id, email, user_type } = req.body;
    if (user_type == "admin" || user_type == "user" || user_type == "productOwner") {
        let checkIsAdmin = await userIsAdmin(_id);
        if (checkIsAdmin) {
            let checkEmailIsExist = await emailIsExist(email);
            if (checkEmailIsExist) {
                let updatUserTypeForSelectedEmail = await userModel.findOneAndUpdate({ email }, { user_type }, { new: true, projection: { _id: 0, age: 0, password: 0 } })
                res.json({ message: "Update User Type Sucessfully", updatUserTypeForSelectedEmail })
            } else {
                res.json({ message: " This Email is not valid!!!!" })
            }
        } else {
            res.json({ message: "You Are Not Authorized", updateUserType })
        }
    } else {
        res.json({ message: " please enter a valid user Type admin , user or productOwner" })
    }
}

// get user by email  >>>> post method take one input email
const getUserByEmail = async (req, res) => {
    const { email } = req.body;
    let getUser = await userModel.findOne({ email }, { _id: 0, password: 0, age: 0 });
    if (getUser) {
        res.json({ message: "get user successfully", getUser })
    } else {
        res.json({ message: "This user is not found" })
    }
}
// get user by Id  >>>> post method take one input email
const getUserById = async (req, res) => {
    const { _id } = req.body;
    let getUser = await userModel.findOne({ _id }, { _id: 0, password: 0, age: 0 });
    if (getUser) {
        res.json({ message: "get user successfully", getUser })
    } else {
        res.json({ message: "This user is not found" })
    }
}

// get all users >> get method
const getAllUsers = async (req, res) => {
    let getAllusers = await userModel.find({},{ password: 0, _id: 0 , user_type:0 });
    if (getAllusers.length >= 0) {
        res.json({ message: "all users ", getAllusers })
    } else {
        res.json({ message: "There is no any user ...." })
    }
}

// get users with name start with x with age less than y
const getUsersAgeFirstLetter = async (req, res) => {
    const { age, startWithLetter } = req.body;
    let getResults = await userModel.find({ age: { $lt: age }, name: { $regex: `^${startWithLetter}` } }, { password: 0, _id: 0 });
    if (getResults.length >= 0) {
        res.json({ message: "all users ", getResults })
    } else {
        res.json({ message: "There is no user ...." })
    }
}

// get users with name end with x
const getUserWithEndByLetter = async (req, res) => {
    const { endLetter } = req.body;
    console.log(endLetter);
    let getResults = await userModel.find({ name: { $regex: `${endLetter}$` } } , { password: 0, _id: 0 })
    if (getResults.length >= 0) {
        res.json({ message: "all users ", getResults })
    } else {
        res.json({ message: " there is no user ...." })
    }
}

//get users with name contains x
const getUserContainsLetter = async (req, res) => {
    const { containsLetter } = req.body;
    console.log(containsLetter);
    let getResults = await userModel.find({ name: { $regex: `${containsLetter}` } }, { password: 0, _id: 0 })
    if (getResults.length >= 0) {
        res.json({ message: "all users ", getResults })
    } else {
        res.json({ message: " there is no user ...." })
    }
}

// get users with name fully match the name variable which destructed from body
const getUserWithFullyNameMatch = async (req, res) => {
    const { name } = req.body;
    console.log(name);
    let getResults = await userModel.find({ name: { $regex: `^${name}$` } } , { password: 0, _id: 0 })
    if (getResults.length >= 0) {
        res.json({ message: "all users ", getResults })
    } else {
        res.json({ message: " there is no user ...." })
    }
}



export {
    addUser,
    singin,
    deleteUser,
    updateUser,
    getUserByEmail,
    getUserById,
    getAllUsers,
    getUsersAgeFirstLetter,
    getUserWithEndByLetter,
    getUserContainsLetter,
    getUserWithFullyNameMatch,
    userIsProductOwner,
    updateUserType
};
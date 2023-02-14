import { productModel } from "../../../databases/models/product.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import * as userContoller from "../users/user.controller.js";


const checkProductIfExist = async (product_id, email) => {
    let checkProduct = await productModel.findOne({ _id: product_id })
    if (checkProduct) {
        let userData = await userModel.findOne({ email });
        if (userData != null) {
            if (JSON.stringify(userData._id) == JSON.stringify(checkProduct.createdBy)) {
                return checkProduct;
            } else {
                return false;
            }
        } else {
            return null;
        }
    } else {
        return null
    }
}



// Product APIs:
// 1- add product

const addProduct = async (req, res) => {
    const { email, name, description, price, stock } = req.body;
    let userData = await userContoller.userIsProductOwner(email);
    if (userData) {
        let addProduct = await productModel.insertMany({ name, description, price, stock, createdBy: userData._id }, { new: true, projection: { _id: 0, createdBy: 0 } })
        res.json({ message: " add product", addProduct })
    } else {
        res.json({ message: " You are not aurhoized to add product, please check with your admin !!!" })
    }
}

// 2- update product (product owner only )
const updateProduct = async (req, res) => {
    const { product_id, email, name, price, stock, description } = req.body;
    let checkProduct = await checkProductIfExist({ _id: product_id }, email);
    if (checkProduct) {
        let updatedProduct = await productModel.findOneAndUpdate({ _id: product_id }, { name, price, stock, description }, { new: true, projection: { _id: 0, createdBy: 0 } })
        res.json({ message: "update product sucessfully", updatedProduct })
    } else {
        res.json({ message: "Warnging This products is not realted to this store" })
    }
}
// 3- delete product ( product owner only)
const deletProduct = async (req, res) => {
    const { product_id, email } = req.body;
    let checkProduct = await checkProductIfExist({ _id: product_id }, email);
    if (checkProduct) {
        let deletedProduct = await productModel.findByIdAndDelete({ _id: product_id }, { new: true, projection: { _id: 0, createdBy: 0 } })
        res.json({ message: "deleted product successfully", deletedProduct })
    } else {
        res.json({ message: "Warnging This products is not realted to this store" })
    }
}
// 4- get all products with their owner's information (populate )
const getAllproductsWithItsOwner = async (req, res) => {
    let productsWithOwner = await productModel.find().populate('createdBy', 'name  -_id');
    if (productsWithOwner.length >= 0) {
        res.json({ message: "all products", productsWithOwner })
    } else {
        res.json({ message: "No result found" })
    }
}
// 5- get product by id
const getProductById = async (req, res) => {
    const { _id } = req.body;
    let result = await productModel.findById(_id);
    res.json({ message: "all products", result })
}


export {
    addProduct,
    updateProduct,
    deletProduct,
    getProductById,
    getAllproductsWithItsOwner
}
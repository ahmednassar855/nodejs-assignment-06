import express from 'express';
import * as productController from "./product.controller.js";

const productRouter = express.Router();

productRouter.post('/api/products/add' , productController.addProduct)
productRouter.post('/api/products/update' , productController.updateProduct)
productRouter.delete('/api/products/delete' , productController.deletProduct)
productRouter.post('/api/products/productId' , productController.getProductById)
productRouter.get('/api/products' , productController.getAllproductsWithItsOwner)



export default productRouter;
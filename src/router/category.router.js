import express from "express";
import cat from "../controller/category.controller.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// CATEGORY ROUTES
router.post("/categories", upload.single("image"), cat.catgoryc);               // create category
router.get("/categories", cat.catgorys);                // get all categories
router.put("/categories/:id",upload.single("image"), cat.catgoryu);            // update category
router.delete("/categories/:id", cat.catgoryd);         // delete category

// PRODUCT ROUTES
router.post("/products", upload.array("images",10), cat.productc);                 // create product
router.get("/products", cat.products);                  // get all products
router.get("/products/category/:categoryId", cat.getProductsByCategory); // get products by category
router.put("/products/:id", upload.array("images",10), cat.productu);              // update product
router.delete("/products/:id", cat.productd);           // delete product

export default router;

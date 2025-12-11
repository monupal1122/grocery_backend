import express from "express";
import subcategoryController from "../controller/subcategoryController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// SUBCATEGORY ROUTES
router.post("/subcategories", upload.single("image"), subcategoryController.subcategoryc);               // create subcategory
router.get("/subcategories", subcategoryController.subcategories);                // get all subcategories
router.get("/subcategories/category/:categoryId", subcategoryController.getSubcategoriesByCategory); // get subcategories by category
router.put("/subcategories/:id", upload.single("image"), subcategoryController.subcategoryu);            // update subcategory
router.delete("/subcategories/:id", subcategoryController.subcategoryd);         // delete subcategory

// PRODUCT BY SUBCATEGORY ROUTES
router.get("/products/subcategory/:subcategoryId", subcategoryController.getProductsBySubcategory); // get products by subcategory

export default router;
// 192.168.43.240
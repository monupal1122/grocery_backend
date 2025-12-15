import productmodel from "../model/product.js";
import categorymodel from "../model/category.js";
import subcategorymodel from "../model/subcategory.js";
import cloudinary from "../config/cloudinary.js";


// === SUBCATEGORY ===

// Create subcategory under category
async function subcategoryc(req, res) {
  try {
    const { name, desc, categoryId } = req.body;

    const category = await categorymodel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "subcategories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const subcategory = new subcategorymodel({
      name,
      image: imageUrl,
      desc,
      category: categoryId,
    });

    await subcategory.save();

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating subcategory",
      error: error.message,
    });
  }
}


// Get all subcategories
async function subcategories(req, res) {
  try {
    const subcategories = await subcategorymodel.find().populate("category", "name");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
}

// Get subcategories by category
async function getSubcategoriesByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const subcategories = await subcategorymodel.find({ category: categoryId });
    res.status(200).json(subcategories);
    console.log(subcategories);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
}

// Update subcategory
async function subcategoryu(req, res) {
  try {
    const { id } = req.params;
    const { name, desc, categoryId } = req.body;

    const subcategory = await subcategorymodel.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    let imageUrl = subcategory.image; // keep old image

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "subcategories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    subcategory.name = name || subcategory.name;
    subcategory.desc = desc || subcategory.desc;
    subcategory.category = categoryId || subcategory.category;
    subcategory.image = imageUrl;

    await subcategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating subcategory",
      error: error.message,
    });
  }
}


// Delete subcategory
async function subcategoryd(req, res) {
  try {
    const { id } = req.params;
    await subcategorymodel.findByIdAndDelete(id);

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error: error.message });
  }
}

// === PRODUCT BY SUBCATEGORY ===

// Get products by subcategory
async function getProductsBySubcategory(req, res) {
  try {
    const { subcategoryId } = req.params;
    const products = await productmodel.find({ subcategory: subcategoryId })
      .populate("category", "name")
      .populate("subcategory", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}
//
// async function uploadimages(req, res) {
//   try {
//     const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

//     const product = await productmodel.create({
//       name: req.body.name,
//       price: req.body.price,
//       images: imagePaths
//     });

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }

// Export
export default {
  getProductsBySubcategory,
  subcategoryc,
  subcategoryd,
  subcategoryu,
  subcategories,
  getSubcategoriesByCategory,
};

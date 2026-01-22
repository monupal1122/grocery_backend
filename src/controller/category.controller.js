import productmodel from "../model/product.js";
import categorymodel from "../model/category.js";
import subcategorymodel from "../model/subcategory.js";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

const ensureCloudinary = (res) => {
  if (isCloudinaryConfigured) return true;
  res
    .status(500)
    .json({
      message:
        "Image upload unavailable: Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    });
  return false;
};

// === CATEGORY ===

// Create category
async function catgoryc(req, res) {
  try {
    const { name, desc, status } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!ensureCloudinary(res)) return;

    cloudinary.uploader.upload_stream(
      { folder: "categories" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed (category create):", error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        const category = new categorymodel({
          name,
          desc,
          image: result.secure_url, // 🔥 CLOUDINARY URL
          status: status || true
        });

        await category.save();

        res.status(201).json({
          message: "Category created successfully",
          category,
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Get all categories
async function catgorys(req, res) {
  try {
    const categories = await categorymodel.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
}

// Update category (with optional image update)
async function catgoryu(req, res) {
  try {
    const { id } = req.params;
    const { name, desc, status } = req.body;

    const updateData = { name, desc };
    if (status !== undefined) updateData.status = status;

    if (req.file) {
      if (!ensureCloudinary(res)) return;

      cloudinary.uploader.upload_stream(
        { folder: "categories" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload failed (category update):", error);
            return res.status(500).json({ message: "Image upload failed" });
          }

          updateData.image = result.secure_url;

          const updatedcategory = await categorymodel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
          );

          res.status(200).json({
            message: "Category updated successfully",
            updatedcategory,
          });
        }
      ).end(req.file.buffer);
    } else {
      const updatedcategory = await categorymodel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      res.status(200).json({
        message: "Category updated successfully",
        updatedcategory,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Delete category
async function catgoryd(req, res) {
  try {
    const { id } = req.params;
    await categorymodel.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
}

// === PRODUCT ===

// Create product under category and subcategory
async function productc(req, res) {
  try {
    const { name, price, desc, categoryId, subcategoryId,discount ,stock } = req.body;

    const category = await categorymodel.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategory = await subcategorymodel.findById(subcategoryId);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    if (!ensureCloudinary(res)) return;

    const imageUploads = req.files.map((file) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          })
          .end(file.buffer);
      })
    );

    const images = await Promise.all(imageUploads);

    const product = new productmodel({
      name,
      images,
      price,
      desc,
      stock,
      discount,
      category: categoryId,
      subcategory: subcategoryId,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Product create failed:", error);
    res.status(500).json({ message: error.message });
  }
}


// Get all products
async function products(req, res) {
  try {
    const products = await productmodel.find()
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 }); // Sort by latest created first
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}

// Get products by category
async function getProductsByCategory(req, res) {
  try {
    const { categoryId } = req.params;
    const products = await productmodel.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}

// Get products by subcategory
async function getProductsBySubcategory(req, res) {
  try {
    const { subcategoryId } = req.params;
    const products = await productmodel.find({ subcategory: subcategoryId })
      .populate("category", "name")
      .populate("Subcategory", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}

// Update product (with optional image update)
async function productu(req, res) {
  try {
    const { id } = req.params;
    const { name, price, desc, categoryId ,discount ,stock } = req.body;

    const updateData = { name, price, desc, category: categoryId ,discount ,stock};

    if (req.files && req.files.length > 0) {
      if (!ensureCloudinary(res)) return;

      const imageUploads = req.files.map((file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "products" }, (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            })
            .end(file.buffer);
        })
      );

      updateData.images = await Promise.all(imageUploads);
    }

    const updatedProduct = await productmodel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Product update failed:", error);
    res.status(500).json({ message: error.message });
  }
}


// Delete product
async function productd(req, res) {
  try {
    const { id } = req.params;
    await productmodel.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
}

// Toggle active status for category
async function toggleActiveCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await categorymodel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.status = !category.status;
    await category.save();
    res.status(200).json({
      message: `Category ${category.status ? 'activated' : 'deactivated'} successfully`,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling category active status", error: error.message });
  }
}

// Toggle active status for product
async function toggleActiveProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productmodel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.status = !product.status;
    await product.save();
    res.status(200).json({
      message: `Product ${product.status ? 'activated' : 'deactivated'} successfully`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling product active status", error: error.message });
  }
}

// Export
export default {
  getProductsByCategory,
  getProductsBySubcategory,
  catgoryc,
  catgoryd,
  catgoryu,
  catgorys,
  products,
  productu,
  productd,
  productc,
  toggleActiveCategory,
  toggleActiveProduct,
};

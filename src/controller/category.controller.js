import productmodel from "../model/product.js";
import categorymodel from "../model/category.js";
import subcategorymodel from "../model/subcategory.js";

// ================= CATEGORY =================

// Create category
async function catgoryc(req, res) {
  try {
    const { name, desc } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const image = `/uploads/${req.file.filename}`;

    const category = new categorymodel({ name, desc, image });
    await category.save();


    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
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
    const { name, desc } = req.body;
    const updateData = { name, desc };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedcategory = await categorymodel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Category updated successfully",
      updatedcategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
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

// ================= PRODUCT =================

// Create product under category and subcategory
async function productc(req, res) {
  try {
    const { name, price, desc, categoryId, subcategoryId } = req.body;

    const category = await categorymodel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = await subcategorymodel.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // Handle multiple images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = new productmodel({
      name,
      images,
      price,
      desc,
      category: categoryId,
      subcategory: subcategoryId,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
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
    const { name, price, desc, categoryId } = req.body;

    const updateData = { name, price, desc, category: categoryId };
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await productmodel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
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
};

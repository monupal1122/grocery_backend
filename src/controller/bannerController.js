import Banner from "../model/bannerModel.js";

// 🟢 Create Banner (with image upload)
export const createBanner = async (req, res) => {
  try {
    const { title, link, bannerType, description, startDate, endDate, priority, imageUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Determine image source: uploaded file OR URI from body
    let finalImageUrl = imageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/banners/${req.file.filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: "Image (file or URL) is required" });
    }

    const bannerData = {
      title,
      imageUrl: finalImageUrl,
      link: link || "",
      bannerType: bannerType || "home",
      description: description || "",
      priority: priority || 0,
    };

    if (startDate && startDate !== "")
       bannerData.startDate = new Date(startDate);
    if (endDate && endDate !== "")
       bannerData.endDate = new Date(endDate);

    const banner = new Banner(bannerData);

    await banner.save();
    res.status(201).json({ success: true, banner, message: "your banner created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating banner", error: error.message });
  }
};



// 🟡 Get All Banners
export const getAllBanners = async (req, res) => {
  try {
    const { bannerType } = req.query;
    const filter = { isActive: true };

    if (bannerType) filter.bannerType = bannerType;

    const banners = await Banner.find(filter).sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners", error: error.message });
  }
};

// 🟣 Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {};

    // Only add fields that are provided and not empty
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.link !== undefined) updateData.link = req.body.link;
    if (req.body.bannerType !== undefined) updateData.bannerType = req.body.bannerType;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;

    // Handle dates
    if (req.body.startDate !== undefined) {
      updateData.startDate = req.body.startDate && req.body.startDate !== "" ? new Date(req.body.startDate) : null;
    }
    if (req.body.endDate !== undefined) {
      updateData.endDate = req.body.endDate && req.body.endDate !== "" ? new Date(req.body.endDate) : null;
    }

    // If new image uploaded
    if (req.file) {
      updateData.imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    const updated = await Banner.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: "Banner not found" });

    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating banner", error: error.message });
  }
};

// 🔴 Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Banner.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Banner not found" });

    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting banner", error: error.message });
  }
};
export default {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
}
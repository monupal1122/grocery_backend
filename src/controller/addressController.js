import Address from "../model/addressModel.js";
import mongoose from "mongoose";

/**
 * @desc    Add new address
 * @route   POST /api/address
 * @access  Private (User)
 */
export const addAddress = async (req, res) => {
  try {
    const { label, fullAddress, city, state, pincode, latitude, longitude, isDefault } = req.body;

    // Ensure logged-in user (assuming req.user._id comes from JWT middleware)
    const userId = req.user?._id || req.body.userId;
    if (!userId) return res.status(401).json({ message: "User ID required" });

    if (!fullAddress || !pincode) {
      return res.status(400).json({ message: "Full address and pincode are required" });
    }

    // If new address isDefault = true, unset all others
    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = new Address({
      userId,
      label: label || "Home",
      fullAddress,
      city,
      state,
      pincode,
      latitude,
      longitude,
      isDefault,
    });

    await newAddress.save();
    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error: error.message });
  }
};

/**
 * @desc    Get all addresses of user
 * @route   GET /api/address
 * @access  Private (User)
 */
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(401).json({ message: "User ID required" });

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error: error.message });
  }
};

/**
 * @desc    Update an address
 * @route   PUT /api/address/:id
 * @access  Private (User)
 */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, fullAddress, city, state, pincode, latitude, longitude, isDefault } = req.body;

    const address = await Address.findById(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // If updated address is default, unset others
    if (isDefault) {
      await Address.updateMany({ userId: address.userId }, { $set: { isDefault: false } });
    }

    address.label = label || address.label;
    address.fullAddress = fullAddress || address.fullAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.latitude = latitude || address.latitude;
    address.longitude = longitude || address.longitude;
    address.isDefault = isDefault ?? address.isDefault;

    await address.save();
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error: error.message });
  }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/address/:id
 * @access  Private (User)
 */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByIdAndDelete(id);

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error: error.message });
  }
};

/**
 * @desc    Set a specific address as default
 * @route   PATCH /api/address/:id/default
 * @access  Private (User)
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Unset other default addresses
    await Address.updateMany({ userId: address.userId }, { $set: { isDefault: false } });
    address.isDefault = true;
    await address.save();

    res.status(200).json({ success: true, message: "Default address set", address });
  } catch (error) {
    res.status(500).json({ message: "Error setting default address", error: error.message });
  }
};

/**
 * @desc    Get all addresses (Admin)
 * @route   GET /api/address/all
 * @access  Private/Admin
 */
export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("userId", "email");
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all addresses", error: error.message });
  }
};

export default {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllAddresses,
}

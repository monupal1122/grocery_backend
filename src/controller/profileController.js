import Profile from "../model/Profile.js";

/**
 * @desc Create or update profile
 * @route POST /api/profile
 * @access Private
 */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phoneNumber, gender, dateOfBirth, bio, email } = req.body;

    // Image from multer
    let profileImage = req.file ? `/uploads/profile/${req.file.filename}` : undefined;

    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile.fullName = fullName || profile.fullName;
      profile.phoneNumber = phoneNumber || profile.phoneNumber;
      profile.gender = gender || profile.gender;
      profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
      profile.bio = bio || profile.bio;
      profile.email = email || profile.email;
      if (profileImage) profile.profileImage = profileImage;

      await profile.save();

      return res.status(200).json({ message: "Profile updated successfully", profile });
    }

    // Create new profile
    const newProfile = new Profile({
      userId,
      fullName,
      phoneNumber,
      gender,
      dateOfBirth,
      bio,
      email,
      profileImage,
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get logged-in user's profile
 * @route GET /api/profile/my
 * @access Private
 */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete user profile
 * @route DELETE /api/profile
 * @access Private
 */
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.deleteOne();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all profiles (Admin)
 * @route GET /api/profile/all
 * @access Private/Admin
 */
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "email");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default {getAllProfiles,getMyProfile,deleteProfile,createOrUpdateProfile}
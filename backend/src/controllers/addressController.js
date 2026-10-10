import User from "../models/User.js";

// ==========================================
// GET SAVED ADDRESSES
// ==========================================

export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Get saved addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch saved addresses.",
    });
  }
};

// ==========================================
// ADD SAVED ADDRESS
// ==========================================

export const addSavedAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all address details.",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // If this address is marked as default,
    // remove default status from existing addresses.
    if (isDefault) {
      user.addresses.forEach((savedAddress) => {
        savedAddress.isDefault = false;
      });
    }

    // If this is the first address, make it default.
    const shouldBeDefault =
      user.addresses.length === 0 ? true : Boolean(isDefault);

    user.addresses.push({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: shouldBeDefault,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address saved successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Add saved address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save address.",
    });
  }
};

// ==========================================
// UPDATE SAVED ADDRESS
// ==========================================

export const updateSavedAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all address details.",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const savedAddress = user.addresses.id(addressId);

    if (!savedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    // If updating this address as default,
    // remove default status from all other addresses.
    if (isDefault) {
      user.addresses.forEach((item) => {
        item.isDefault = false;
      });
    }

    savedAddress.fullName = fullName.trim();
    savedAddress.phone = phone.trim();
    savedAddress.address = address.trim();
    savedAddress.city = city.trim();
    savedAddress.state = state.trim();
    savedAddress.pincode = pincode.trim();
    savedAddress.isDefault = Boolean(isDefault);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Update saved address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update address.",
    });
  }
};

// ==========================================
// DELETE SAVED ADDRESS
// ==========================================

export const deleteSavedAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const savedAddress = user.addresses.id(addressId);

    if (!savedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const wasDefault = savedAddress.isDefault;

    savedAddress.deleteOne();

    // If the deleted address was the default one,
    // make the first remaining address default.
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Delete saved address error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete address.",
    });
  }
};
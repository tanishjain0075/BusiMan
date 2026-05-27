const Vendor = require('../models/Vendor.model');

const getVendors = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [vendors, total] = await Promise.all([
      Vendor.find(filter).skip(skip).limit(parseInt(limit)).sort({ name: 1 }),
      Vendor.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: vendors.length,
      totalPages: Math.ceil(total / parseInt(limit)),
      data: vendors,
    });
  } catch (err) {
    next(err);
  }
};

const getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }
    res.status(200).json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }
    res.status(200).json({ success: true, message: 'Vendor deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVendors, getVendor, createVendor, updateVendor, deleteVendor };

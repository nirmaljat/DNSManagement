import { DNS } from "../model/DNS.js";
import ErrorHandler from "../middleware/error.js";
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

export const newDNS = async (req, res, next) => {
  try {
    const { name, type, value } = req.body;

    await DNS.create({
      name,
      type,
      value,
      user: req.user._id,  
    });

    res.status(201).json({
      success: true,
      message: "DNS Added"
    });
  } catch (error) {
    next(error);
  }
}

export const getMyDNS = async (req, res, next) => {
  try {
    const userid = req.user._id;

    const dnss = await DNS.find({ user: userid });

    res.status(200).json({
      success: true,
      dnss,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyDNS = async (req, res, next) => {
  try {
    const { name, type, value } = req.body;
    const dns = await DNS.findById(req.params.id);
    if (!dns) {
      return next(new ErrorHandler("DNS not found", 404));
    }
    if (name) dns.name = name;
    if (type) dns.type = type;
    if (value) dns.value = value;
    await dns.save();

    res.status(200).json({
      success: true,
      message: "UPDATED"
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDNS = async (req, res, next) => {
  try {
    const dns = await DNS.findById(req.params.id);
    if (!dns) return next(new ErrorHandler("DNS not found", 404));
    await dns.deleteOne();
    res.status(200).json({
      success: true,
      message: "deleted"
    });
  } catch (error) {
    next(error);
  }
};

export const bulk = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString();
      const records = JSON.parse(fileContent);

      if (!Array.isArray(records)) {
        return res.status(400).json({ message: "Invalid data format" });
      }

      const userRecords = records.map(record => ({
        ...record,
        user: req.user._id
      }));

      await DNS.insertMany(userRecords);
      res.status(200).json({ message: "DNS records added successfully" });
    } catch (error) {
      next(error);
    }
  });
};

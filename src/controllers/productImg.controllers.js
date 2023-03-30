const catchError = require("../utils/catchError");
const ProductImg = require("../models/ProductImg");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../utils/cloudinary");

const getAll = catchError(async (req, res) => {
  const result = await ProductImg.findAll();
  return res.json(result);
});

const create = catchError(async (req, res) => {
  const { path, filename } = req.file;
  const { url, public_id } = await uploadToCloudinary(path, filename);
  const image = await ProductImg.create({ url, publicId: public_id });
  return res.status(201).json(image);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);
  if (!image) return res.sendStatus(404);
  fs.unlinkSync(
    path.join(__dirname, "..", "public", "uploads", image.filename)
  );
  await image.destroy();
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove,
};

const Product = require("../Models/Product");
const User = require("../Models/User");
const { validationResult } = require("express-validator");
const { uploadOnCloudinary } = require("../Services/Cloudnary");
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

async function handleGetProducts(req, res) {

  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filtering()
    // .sorting()
    // .pagination();
    const products = await features.query;
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

async function handleCreateProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

      const { title, price, description, content, imagePath, category } =
        req.body;
        console.log(req.body);
        
        const userID = req.user.id;
        const image = await uploadOnCloudinary(imagePath);
       console.log(image)
      const newproduct = await Product.create({
        userID,
        name: title,
        price,
        description,
        image,
        category,
        content,
        category
      });
    return res.status(200).json({ msg: "Product Added" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}



module.exports = {
  handleGetProducts,
  handleCreateProduct,

}
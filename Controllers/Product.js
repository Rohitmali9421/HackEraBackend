const Product = require("../Models/Product");
const {handleRecommendation}=require("../Services/Recommendation")
// import { handleRecommendation } from "../Services/Recommendation";
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

    //   const { title, price, description, content, imagePath, category } =
    //     req.body;

    //   const image = await uploadOnCloudinary(req.file.path);
    //   const newproduct = await Product.create({
    //     title: title,
    //     price,
    //     description,
    //     content,
    //     image,
    //     category: cat.id,
    //   });
    return res.status(200).json({ msg: "Product Added" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
async function handleRecomendedProduct(req, res) {
  // const userId = req.user.id
  const userId = 1
  const productData = [
    {
      "user_id": 1,
      "product_id": 123,
      "product_name": "Santoor",
      "view_time": 2,
      "visit_count": 3,
      "liked": 1
    }, {
      "user_id": 1,
      "product_id": 124,
      "product_name": "iphone 11",
      "view_time": 90,
      "visit_count": 11,
      "liked": 1
    }, {
      "user_id": 1,
      "product_id": 125,
      "product_name": "blue shirt",
      "view_time": 5,
      "visit_count": 1,
      "liked": 0
    }, {
      "user_id": 1,
      "product_id": 126,
      "product_name": "laptop",
      "view_time": 30,
      "visit_count": 20,
      "liked": 0
    }
  ]
  console.log(handleRecommendation(userId, productData));
  
  return res.status(200).json({msg:"Recommendation generated"})
  // const productData=req.
}
module.exports = {
  handleGetProducts,
  handleCreateProduct,
  handleRecomendedProduct
}
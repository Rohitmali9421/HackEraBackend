const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Category",
    trim:true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: Object,
    required: true,
  },
  ratings: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    default:0,
    min: 1,
    max: 5,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

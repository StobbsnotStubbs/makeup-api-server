"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;







mongoose.connect("mongodb://127.0.0.1:27017/productsapi")
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err))




const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: String,
  imageUrl: String,
  description: String,
});

const productModel = mongoose.model("product", productSchema);

function seedProductCollection() {
  const bronzer = new productModel({
    name: "Hi-Light Booster Bronzer",
    brand: "maybelline",
    price: "14.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/991799d3e70b8856686979f8ff6dcfe0_ra,w158,h184_pa,w158,h184.png",
    description:
      "Maybelline Face Studio Master Hi-Light Light Boosting bronzer formula has an expert balance of shade + shimmer illuminator for natural glow. Skin goes soft-lit with zero glitz.",
  });
  const contour = new productModel({
    name: "Contour Kit",
    brand: "maybelline",
    price: "15.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/4f731de249cbd4cb819ea7f5f4cfb5c3_ra,w158,h184_pa,w158,h184.png",
    description:
      "Maybelline Facestudio Master Contour Kit is the ultimate on the go all-in-one palette, with contouring brush included.  Define and highlight in a New York minute with this effortless 3-step face contouring kit.",
  });
  const blush = new productModel({
    name: "truBLEND Blush in Light Rose",
    brand: "maybelline",
    price: "13.99",
    imageUrl:
      "https://d3t32hsnjxo7q6.cloudfront.net/i/0b8787d62ced45700c0693b869645542_ra,w158,h184_pa,w158,h184.png",
    description:
      "Never stop blushing with CoverGirl New truBLEND blush! Features:New marbled baked formulaUltra-blendable and delivers a beautiful, multi-toned result Designed to fit light, medium and deep skin tones alike",
  });
  bronzer.save();
  contour.save();
  blush.save();
}

//seedProductCollection();


// Use body-parser middleware to parse request body
app.use(bodyParser.json());

// Define the "/product" endpoint for creating a new product
app.post('/product', (req, res) => {
  const newProduct = req.body;
  productsapi.products().then(products => {
    // Generate a unique ID for the new product
    newProduct.id = products.length + 1;
    // Add the new product to the products array
    products.push(newProduct);
    // Send response to the client with all products that contain the new one
    const result = products.filter(product => product.id === newProduct.id || product.name === newProduct.name);
    res.status(201).send(result);
  }).catch(err => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });
});

// Routes
app.get("/", homePageHandler);
app.get("/productsapi", getAPIProductsHandler);
app.get("/product", getProductsHandler);

// Routes Handlers
function homePageHandler(req, res) {
  res.send("server is alive");
}

async function getAPIProductsHandler(req, res) {
  let productsapi = await axios.get(
    "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline"
  );
  res.status(200).send(productsapi.data);
}

async function getProductsHandler(req, res) {
  let products = await productModel.find({});
  res.send(products);
  // productModel.find({},function(err,products){
  //     if(err) {
  //         console.log('did not work')
  //     } else {
  //         res.send(products);
  //     }
  // })
}

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

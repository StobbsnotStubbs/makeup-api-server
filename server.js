"use strict";

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

//connect my node app to makeup db in Mongodb server
mongoose.connect('mongodb://localhost:27017/productsapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to database!');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

// Collection: Schema and model
// Schema: determine the shape of our data || blueprint or template for our collection
const productSchema = new mongoose.Schema({
  brand: String,
  price: String,
  imageURL: String,
  description: String,
});

// Schema: drawing phase
// Model: creation phase
const makeupProduct = mongoose.model('makeupProduct', productSchema);

// Seed our database
function seedmakeupProduct() {
  const eyeShadow = new makeupProduct({
    brand: "Maybelline",
    price: "7",
    imageURL: "testesttestestest",
    description: "Gans on your eyes like",
  });
  eyeShadow.save();
}

seedmakeupProduct();

app.get('/', homeHandler);

app.get('/productsapi', (req, res) => {
  const url = 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline';
  axios.get(url)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.send('An error occurred while fetching the data.');
    });
});

function homeHandler (req,res) {
  res.status(200).send('all good');
}

app.listen(PORT, ()=>{
  console.log(`Listening on ${PORT}`);
});

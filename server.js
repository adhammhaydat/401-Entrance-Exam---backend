"use strict";
const util = require("util");
const TextEncoder = new util.TextEncoder();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv").config();
const server = express();
server.use(express.json());
server.use(cors());
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const URL_API=process.env.URL_API

mongoose.connect(
  "mongodb://adhammhaydat:12345@cluster0-shard-00-00.qi4a6.mongodb.net:27017,cluster0-shard-00-01.qi4a6.mongodb.net:27017,cluster0-shard-00-02.qi4a6.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ipru7s-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const flowersSchema = new mongoose.Schema({
  instructions: String,
  photo: String,
  name: String,
});

const flowerModel = mongoose.model("flowers", flowersSchema);
server.get("/", (req, res) => {
  res.send("hello");
});
function showAllData(req, res) {
  axios
    .get(URL_API)
    .then((result) => {
      res.send(result.data);
    });
}
function addToFav(req, res) {
  const { instructions, photo, name } = req.body;
  const newFlowers = new flowerModel({
    instructions: instructions,
    photo: photo,
    name: name,
  });
  newFlowers.save();
  res.send(newFlowers);
}
function showFav(req, res) {
  flowerModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

function deleteFav(req, res) {
  let id = req.params.id;
  flowerModel.findByIdAndDelete(id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}
function updatData(req, res) {
  let id = req.params.id;
  const { instructions, photo, name } = req.body;
  flowerModel.findOne({ _id: id }, (err, result) => {
    result.instructions = instructions;
    result.photo = photo;
    result.name = name;
    result.save();
    res.send(result);
  });
}
server.get("/showData", showAllData);
server.post("/addfav", addToFav);
server.get("/showFav", showFav);
server.delete("/deleteFav/:id", deleteFav);
server.put("/updatData/:id", updatData);
server.listen(PORT, () => {
  console.log(`i am a live on port ${PORT}`);
});

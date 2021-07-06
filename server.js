'use strict'

require('dotenv').config();
const express = require('express')
const cors = require('cors');
const mongoose = require("mongoose");
const axios = require("axios");

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;
// const PORT=3010;

mongoose.connect(`mongodb://localhost:27017/drinks`, { useNewUrlParser: true });

const drink = new mongoose.Schema ({
    strDrink: String,
    strDrinkThumb: String,
    idDrink: String
})

const drinkModel= mongoose.model('drinks',drink);


server.get(`/getdrinks`,getDrinks);
server.post(`addtofavorite`,addToFavorite);
server.get(`getfavorite`,getFavorite);
server.delete(`/delete/:id`,deleteDri);
server.put(`/update/:id`,updateDri);

function getDrinks (req,res) {
    axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic`).then(result => {
        res.send(result).data;
    }
    )
}

function addToFavorite (req,res) {
    const {strDrink,strDrinkThumb,idDrink} = req.body;
    const newDrink = new drinkModel ({
        strDrink: strDrink,
        strDrinkThumb: strDrinkThumb,
        idDrink: idDrink
    })
    newDrink.save();
}

function getFavorite (req,res) {
    drinkModel.find({},(err,data) => {res.send(data);
    })
}

function deleteDri (req,res) {
    const id = req.params.id;
    drinkModel.findByIdAndDelete(id,(err,data) => {
        drinkModel.find ({},(arr,newData) => {
            res.send(newData)
        })
    })
}

function updateDri (req,res) {
    drinkModel.find({},(err,data) => {
        data.map((item,idx) => {
            if (idx == req.params.id){
                item.strDrink=req.body.strDrink;
                item.strDrinkThumb=req.body.strDrinkThumb;
                item.idDrink=req.body.idDrink;
                item.save()
            }
        })
        res.send(data);
    })
}

server.get('/',
 function (req, res) {
  res.send('Hello World')
})


server.listen(PORT, () => console.log(`listening on ${PORT}`))
// server.listen(3010,() => {console.log('listening on 3010');
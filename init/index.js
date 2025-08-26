const express = require('express');
const initData = require("./data")
const mongoose = require('mongoose')
const mongo_url = "mongodb://localhost:27017/wanderlust";
const Listing = require('../models/listings')

async function main() {
    try {
        await mongoose.connect(mongo_url);
    }
    catch (err) {
        throw err;
    }
}
main()
    .then(() => {
        console.log("connection done");
    })
    .catch(err => {
        console.log(err);
    })

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"68a751e92f6555fa10b99e05"}))
    await Listing.insertMany(initData.data);
    console.log("data was inserted");
}

initDB();
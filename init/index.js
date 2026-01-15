const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() =>{
    console.log("connected to db");
}).catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});

    const listingsWithOwner = initData.data.map((obj) => ({
        ...obj,
        owner: "694eab3648b1b1023d495106",
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log("data was initialized");
};

initDB();

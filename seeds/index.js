

const mongoose = require("mongoose");
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")
const Campground = require("../models/campground");


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(let i = 0; i< 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        const price = Math.floor(Math.random() *20) +10
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://images.unsplash.com/photo-1529385101576-4e03aae38ffc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem magnam necessitatibus voluptates, distinctio in, nihil vero assumenda sapiente, aspernatur quis atque aperiam repudiandae. Necessitatibus perferendis consequatur excepturi expedita dicta doloremque.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})


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
            author: "64134b9ce8ef81f3292701c1",
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dhlroozpk/image/upload/v1679071406/YelpCamp/uzzxfzz5u0rztlcjb5sr.jpg',
                  filename: 'YelpCamp/uzzxfzz5u0rztlcjb5sr'
                },
                {
                  url: 'https://res.cloudinary.com/dhlroozpk/image/upload/v1679071410/YelpCamp/sggbaub0snymbvlvzmek.jpg',
                  filename: 'YelpCamp/sggbaub0snymbvlvzmek',
                }
              ],
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem magnam necessitatibus voluptates, distinctio in, nihil vero assumenda sapiente, aspernatur quis atque aperiam repudiandae. Necessitatibus perferendis consequatur excepturi expedita dicta doloremque.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})
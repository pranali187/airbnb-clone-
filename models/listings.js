let mongoose = require("mongoose");
const reviews = require("./review");
let Schema = mongoose.Schema;

let default_link = "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String
    },
    location: String,
    price: Number,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"], // GeoJSON requires 'Point'
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await reviews.deleteMany({ _id: { $in: listing.reviews } })
    }

})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

import mongoose from "mongoose";

const shortLinkSchema = mongoose.Schema({
    _id : String,
    originalUrl:String,
    shortenedUrl:String,
    createdBy:String,
    specialName:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    expiresAt:Date,
    clickCount:{
        type:Number,
        default:0
    }
});

const ShortLink = mongoose.model("ShortLink",shortLinkSchema);

export default ShortLink;
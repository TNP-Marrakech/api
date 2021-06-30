//Mongoose it helps us to create our models that we can create our  documents inside
const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
    {
        userId: {
          type: String,
          required: true,
        },
        desc: {
          type: String,
          max: 500,
          required:true
        },
        img: {
          type: String,
        },
        likes: {
          type: Array,
          default: [],
        },
        comments:{
            type: Array,
            default: [],
        }
      },
    {timestamps:true}
);
module.exports=mongoose.model("Post", PostSchema)
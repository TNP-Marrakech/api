const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema(
    {
        userId: {
          type: String,
          required: true,
        },
        question: {
          type: String,
          max: 500,
        },
        comments:{
            type: Array,
            default: [],
        }
      },
    {timestamps:true}
);
module.exports=mongoose.model("Question", QuestionSchema)
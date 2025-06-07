const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    coverImageUrl: {
        type: String,
    },

    body:{
        type:String,
    },

    createdBy: {
        type: Schema.Types.ObjectId, // ✅ Corrected
        ref: "user"
    },

}, { timestamps: true });

const Blog = model("blog", blogSchema);

module.exports = Blog;

const { Router } = require("express");
const multer = require("multer");
const router = Router();
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const Comment=require("../models/comment")
// Ensure uploads folder exists
const uploadPath = path.resolve("./public/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()} - ${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

router.get("/addnew", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

router.get("/:id",async(req,res)=>{
  const blog=await Blog.findById(req.params.id).populate("createdBy");
  const comments=await Comment.find({blogId:req.params.id}).populate(
    "createdBy"
  )
  return res.render("blog",{
    user:req.user,
    blog,
    comments,
  })
})

router.post("/", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;
  try {
    const blog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageUrl: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Blog creation error:", error);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/blog/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render("blogdetails", { blog });
});


router.post("/comment/:blogId",async (req,res)=>{
  const comment=await  Comment.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id,
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})




module.exports = router;

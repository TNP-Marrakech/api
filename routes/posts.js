const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//test
/*router.get("/",(req,res)=>{
    console.log("post page")
})*/

/*=========================CRUD========================*/

//create post
router.post("/",async (req,res)=>{
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json("savedPost")
    }catch(err){
        res.status(500).json(err)
    }
})

router.put("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });


//delete post
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      console.log("sa marche hna");
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
//like post
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      //after ma l9ina lpost we check post like array include this user or not
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
//get post
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        //fetch all data
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      //find all post of following user using promise and map Promise.all because we gonna use map
      //friendPosts is an array of posts
      const friendPosts = await Promise.all(
          //for each friendid
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      //ghayakhod ga3 les post dyal friends et il va concaténer avec userpost
      res.status(200).json(userPosts.concat(...friendPosts))
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  //get user's all posts
  router.get("/profile/:username", async (req, res) => {
    try {
      const user= await User.findOne({username:req.params.username})
      
       const posts = await Post.find({userId: user._id});
       res.status(200).json(posts)
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

module.exports = router;
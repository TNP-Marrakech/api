const router = require("express").Router();
const User = require("../models/User");
const Question = require("../models/Question")


router.post("/",async (req,res)=>{
    const newQuestion = new Question(req.body)
    try{
        const savedQuestion = await newQuestion.save();
        res.status(200).json("savedPost")
    }catch(err){
        console.log("Post question")
        res.status(500).json(err)
    }
})

router.put("/:id", async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      if (question.userId === req.body.userId) {
        await question.updateOne({ $set: req.body });
        res.status(200).json("the question has been updated");
      } else {
        res.status(403).json("you can update only your questions");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });


//delete question
router.delete("/:id", async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
      console.log("sa marche hna");
      if (question.userId === req.body.userId) {
        await question.deleteOne();
        res.status(200).json("the question has been deleted");
      } else {
        res.status(403).json("you can delete only your question");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get question
router.get("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });
//get timeline questions
router.get("/timeline/:username", async (req, res) => {
    try {
        //fetch all data
      const currentUser = await User.findByUsername(req.params.username);
      const userQuestions = await Question.find({ username: currentUser.username });
      console.log(userQuestions)
      //find all post of following user using promise and map Promise.all because we gonna use map
      //friendPosts is an array of posts
     /* const friendPosts = await Promise.all(
          //for each friendid
        currentUser.followings.map((friendId) => {
          return Question.find({ userId: friendId });
        })
      );*/
      //ghayakhod ga3 les post dyal friends et il va concaténer avec userpost
      res.status(200).json(userQuestions)
      console.log(userQuestions + "rzfzgzgfe")
    } catch (err) {
        console.log("erreur timeline questions")
      console.log(err);
      res.status(500).json(err);
    }
  });
 
module.exports = router;
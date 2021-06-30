//Create Router
const router = require("express").Router();
const User = require("../models/User");
//asychronous fonction
const bcrypt = require("bcrypt")

/*======================REGISTER========================*/
//Process Async
router.post("/register", async (req,res)=>{
    try {
        //generate a Salt
        //A promise to be either resolved with the generated salt or rejected with an Error  
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        //Create New User
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password: hashedPassword,
        });

        //Save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err)
    }
});
/*======================LOGIN========================*/
router.post("/login",async(req,res)=>{
    //try to find user
    const {email,password}=req.body;
    console.log(email)
    try{
    const user = await User.findOne({email});
    console.log(user)
    if(!user) return res.status(404).send("user not found");
        console.log(user)
    const validPassword = await bcrypt.compare(password,user.password);
    if(!validPassword) return res.status(400).json("wrong password")

    res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }

});
router.post("/admin",async (req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(404).send("admin not found");
        console.log(req.body.isAdmin)
        if (user.isAdmin === true){
            const validPassword = await bcrypt.compare(req.body.password,user.password)
            !validPassword && res.status(400).json("wrong password")
        res.status(200).json(user)
        }
        else{
            res.status(500).json("this user is not admin")
        }
    }catch(err){
        res.status(500).json(err)}
});

/*router.get("/",(req,res)=>{
    res.send("hey its user route")
})*/

//to use it in index file
module.exports = router;
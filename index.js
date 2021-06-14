
//Express FILE
const express = require("express");
const app = express();
const mongoose =require("mongoose");
const dotenv =require("dotenv");
const helmet =require("helmet");
const morgan = require("morgan");
const userRoute  = require("./routes/users");
const authRoute  = require("./routes/auth");
const postRoute  = require("./routes/posts");
const multer = require("multer");
const path = require("path")
//dotenv configuration
//DotEnv after creating MongoDB its gonna gives us some secret 
//URL which include our username password
dotenv.config();


//Connect to mongoDB with mongoose.connect()
mongoose.connect(process.env.MONGO_LOCAL, {useNewUrlParser: true,useUnifiedTopology: true},()=>{
    console.log("Connected to MongoDB")
});

//so on utilise ce path Ne demande pas de requete en contrepartie juste aller à ce directory 
app.use("/images", express.static(path.join(__dirname, "public/images")))

//==========================================================================
//=================================middleware=================================
//Express fonctionne avec des middlewares.
// Ce sont des fonctions qui s’exécutent les unes après les autres dans l’objectif de créer une application web.
//body parser where you make POST requestit's just gonna parser it 
app.use(express.json());

app.use(helmet())
app.use(morgan("common")); 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

/*
app.get("/",(req,res)=>{
    res.send("welcome to homepage")
})
app.get("/users",(req,res)=>{
    res.send("welcome to user page")
})*/


//Use of the application listen(port (after)--> log  )
app.listen(8800,()=>{
    console.log("serveur backend")
})
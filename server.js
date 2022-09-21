const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { json } = require("express");
const products = require('./models/product');
const Registeruser = require("./models/usermodel")
const jwt = require("jsonwebtoken");
const middleware = require("./middleware/middleware");
const app = express();


const CONNECTION_URL = "mongodb+srv://hbabhisheka15:D-word1234@cluster0.bbimoow.mongodb.net/?retryWrites=true&w=majority"
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log('DB Connected'),app.listen(PORT,()=> console.log(`Server running...in the PORT ${PORT}`))})
.catch((err)=>{console.log(err)})

app.use(express.json())

app.use(cors({
    origin: '*'
}))

app.get("/",(req,res)=>{res.send("hello world !");})

app.post("/register",async(req,res)=>{
    try{
        const {fullname,email,password,confirmpassword} = req.body;
        const exist = await Registeruser.findOne({email});
        if(exist)
        {
            return res.status(400).send("user Allredy Registerd");
        }
        if(password != confirmpassword)
        {
           return res.status(403).send("Password Invalid");
        }
        let newUser = new Registeruser({
            fullname,
            email,
            password,
            confirmpassword
        })

        newUser.save();
        return res.status(200).send("User Registerd")

    }
    catch(error){
        console.log(error);
        return res.status(500).send("Server Error")

    }
})

app.post("/",async(req,res)=>{
    try{
        const{email,password} = req.body;
        let exist =await Registeruser.findOne({email});
        if(!exist)
        {
            return res.status(400).send("User Not Found")
        }
        if(exist.password != exist.confirmpassword)
        {
            return res.status(403).send("invalid password")
        }

        let payload = {
            user : { 
                id :exist.id
            }
        }

        jwt.sign(payload,"jwtsecrtcode",{expiresIn : 3600000000}, 
        (error,token)=>{
            if(error) throw error;
            return res.json({token});
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).send("Invalid Token")

    }
})



app.get("/products",middleware,async (req,res)=>{
    try{
        let exist =  await Registeruser.findById(req.user.id); 
        if(!exist)
        {
            return res.status(400).send("User Not Found")
        }
        res.json(exist);
    }
  
    catch(error){
        console.log(error);
        return res.status(500).send("server error")

    }
})

app.post('/addtask',async(req,res)=>{
    const {todo} = req.body;
    try{
        const newData = new TaskSchema({
            todo : todo
        });
        await newData.save();
        return res.json(await TaskSchema.find())
    }
    catch(err){
        console.log(err)
    }
})

app.get('/gettask',async(req,res) => {
    try{
        return res.json(await TaskSchema.find()) ;
    }
    catch(err){
        console.log(err)
    }
})

app.delete('/delete/:id',async(req,res) => {
    try{
        await TaskSchema.findByIdAndDelete(req.params.id);
        return res.json(await TaskSchema.find())
    }
    catch(err){
        console.log(err)
    }
})


mongoose.set("useFindAndModify",false)


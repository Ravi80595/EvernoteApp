const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserRouter = express.Router()

const { UserModel } = require("../Modles/User.model")


// Sign up logic here

UserRouter.post("/signup",async(req,res)=>{
    const {email,password,name,age}= req.body
    const userPresent = await UserModel.findOne({email})
    if(userPresent){
        res.status(201).send({"msg":"User Already Exists"})
    }
try{
    bcrypt.hash(password,4,async function(err,hash){
        const user = new UserModel({email,password:hash,name,age})
        await user.save()
        res.send({"msg":"Signup Successfull"})
    })

}
catch(err){
    console.log(err)
    res.send(400).send({"err":"Something went wrong"})
}
})

// Login here

UserRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = await UserModel.find({email})
        if(user.length>0){
            const hashed_password = user[0].password
            bcrypt.compare(password,hashed_password,function(err,result){
                if(result){
                    const token= jwt.sign({"userID":user[0]._id},'ravi')
                    res.status(200).send({"msg":"Login Success","token":token})
                }else{
                    res.status(400).send({"msg":"Login Failed"})
                }
            })
        }else{
            res.status(400).send({"msg":"Login Failed"})
        }
    }
    catch(err){
        console.log(err)
        res.send(400).send({"err":"Something went wrong"})
    }
})

UserRouter.get("/allUser",async(req,res)=>{
    try{
        const users = await UserModel.find()
        res.status(200).send({"msg":"All Users are here",users})
    }
    catch(err){
        console.log(err)
        res.send(400).send({"err":"Something went wrong"})
    }
})


module.exports={
    UserRouter
}
const User = require('../database/user');
const fs = require('fs');
const path = require('path');

exports.profile=(req,res)=>{
  
    res.status(200).send({
        message: "success",
        user:req.user
      });

    }



exports.profileUpdate=async (req,res)=>{

  let values=req.body;
  

   if(!(Object.keys(req.files).length === 0))
   {
    let allFiles=req.files;
  
    for (var key in allFiles) {
      values[key]=allFiles[key][0]?.path;
    }
   }


  let response;
  if(!(Object.keys(values).length === 0))
   {
   response=await User.findByIdAndUpdate(req.user._id,values,{
    new:true,
    newValidator:true,
      runValidator:true
    })
   }

   req.session.user=response;
    res.status(200).send({
        message: "success",
        user:response
      });
}

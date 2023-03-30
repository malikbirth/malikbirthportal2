import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
import authenticateToken from '../middleware/auth.js';
import User from '../db/model/user.js';
import Birth from '../db/model/birth.js';

import {
  validateAdhar,
  genToken
} from '../utils/utils.js';

const router = express.Router();
// utils methods 
const prefix = 'XXXXXXXX';

// Login Logout......

router.post('/login', async (req , res)=> {
  const { username , password } = req.body;
  if(!username || !password) {
    return res.status(402).json({
      code : 402,
      message : "Please Send username and password"
    })
  }
  try {
    const user = await User.findOne({username , password}, {password : 0});
    if(user){
      return res.json({
        user : user,
        token : genToken(user.username)
      })
    }else{
      return res.status(404).json({
        code : 404,
        message : 'User Name Or Password May Be Incorrect'
      })
    }
    
  } catch (e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
  
})
router.post('/logout', authenticateToken ,(req, res)=> {
  res.json({
    status : 200,
    message : "You Are Logged Out"
  })
})

/* ******************************  */

// create .....
router.post('/newbirth',authenticateToken,async (req, res)=> {
  if(!req.body.data) return res.status(400).json({code : 400, message: "No data Found"})
  const {
    name,
    adhar_number,
    dob,
    dob_en,
    gen,
    pob,
    fa_name,
    fa_adhar_num,
    mo_name,
    mo_adhar_num,
    village,
    post,
    block,
    thana,
    district,
    state,
    zipcode
  } = req.body.data;
  if(!name) return res.status(400).json({code : 400, message : 'Name Not Found'})
  if(!adhar_number) return res.status(400).json({code : 400, message : 'Adhar Number Not Found'})
  if(!dob) return res.status(400).json({code : 400, message : 'DOB Not Found'})
  if(!dob_en) return res.status(400).json({code : 400, message : 'DOB In English Not Found'})
  if(!gen) return res.status(400).json({code : 400, message : 'Gender Not Found'})
  if(!pob) return res.status(400).json({code : 400, message : 'Place Of Birth Not Found'})
  if(!fa_name) return res.status(400).json({code : 400, message : 'FATHER NAME Not Found'})
  if(!fa_adhar_num) return res.status(400).json({code : 400, message : 'FATHER ADHAR Not Found'})
  if(!mo_name) return res.status(400).json({code : 400, message : 'MOTHER NAME Not Found'})
  if(!mo_adhar_num) return res.status(400).json({code : 400, message : 'MOTHER ADHAR Not Found'})
  if(!village) return res.status(400).json({code : 400, message : 'VILLAGE Not Found'})
  if(!post) return res.status(400).json({code : 400, message : 'POST Not Found'})
  if(!block) return res.status(400).json({code : 400, message : 'BLOCK Not Found'})
  if(!thana) return res.status(400).json({code : 400, message : 'THANA Not Found'})
  if(!district) return res.status(400).json({code : 400, message : 'DISTRICT Not Found'})
  if(!state) return res.status(400).json({code : 400, message : 'STATE Not Found'})
  if(!zipcode) return res.status(400).json({code : 400, message : 'Zipcode Not Found'})
  if(!validateAdhar(adhar_number)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  if(!validateAdhar(fa_adhar_num)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  if(!validateAdhar(mo_adhar_num)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  try {
    const user = await User.findOne({username :req.user.username}, {password : 0})
    if(user.coins >= 20){
    await User.updateOne({username :req.user.username}, {$set : {coins : user.coins - 20}})
    const date = new Date();
    let x = date.toLocaleTimeString();
    x = x.replace('AM', '');
    x = x.replace('PM', '');
    x = x.trim()
    let dataID = `B-${date.getFullYear()}: ${Math.floor(Math.random()*11)}-${Math.floor(Math.random()*99999)}-${Math.floor(Math.random()*999999)}`;
    const birth = await new Birth({
    author : req.user.username,
    regisnum : dataID,
    date : date.toLocaleDateString(),
    time : x,
    name,
    adhar_number,
    dob,
    dob_en,
    gen,
    pob,
    fa_name,
    fa_adhar_num,
    mo_name,
    mo_adhar_num,
    village,
    post,
    block,
    thana,
    district,
    state,
    zipcode
    }).save()
    return res.json({
      code : 200,
      message : "created",
      birthID : dataID
    });
    }else{
      return res.json({
          created : false,
          message : "No Have Money! Please Add Money"
        })
    }

  } catch (e) {
    return res.status(500).json({
      message: "Server Error",
      e : e
    })
  }
})

// read.....
router.get('/birthOrders', authenticateToken, async (req, res) => {
  try {
    const records = await Birth.find({author : req.user.username});
    res.json({
      user : req.user,
      data : records
    })
  } catch (e) {
    return res.status(500).json({
      message: "Server Error",
      e : e
    })
  }
})

// update ...... 
router.get('/update/:id', authenticateToken, async (req, res)=> {
  const rec_id = req.params.id;
  const user = req.user.username;
  try {
    const data = await Birth.findOne({_id : rec_id, author : user}, {__v : 0});
    return res.json(
      data
    )
  } catch (e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
})


router.post('/update/:id' , authenticateToken, async (req, res)=> {
  const rec_id = req.params.id;
  const user = req.user.username;
  if(!req.body.data) return res.status(400).json({code : 400, message: "No data Found ! Send Data to update"})
  const {
    name,
    adhar_number,
    dob,
    dob_en,
    gen,
    pob,
    fa_name,
    fa_adhar_num,
    mo_name,
    mo_adhar_num,
    village,
    post,
    block,
    thana,
    district,
    state,
    zipcode
  } = req.body.data;
  if(!name) return res.status(400).json({code : 400, message : 'Name Not Found'})
  if(!adhar_number) return res.status(400).json({code : 400, message : 'Adhar Number Not Found'})
  if(!dob) return res.status(400).json({code : 400, message : 'DOB Not Found'})
  if(!dob_en) return res.status(400).json({code : 400, message : 'DOB In English Not Found'})
  if(!gen) return res.status(400).json({code : 400, message : 'Gender Not Found'})
  if(!pob) return res.status(400).json({code : 400, message : 'Place Of Birth Not Found'})
  if(!fa_name) return res.status(400).json({code : 400, message : 'FATHER NAME Not Found'})
  if(!fa_adhar_num) return res.status(400).json({code : 400, message : 'FATHER ADHAR Not Found'})
  if(!mo_name) return res.status(400).json({code : 400, message : 'MOTHER NAME Not Found'})
  if(!mo_adhar_num) return res.status(400).json({code : 400, message : 'MOTHER ADHAR Not Found'})
  if(!village) return res.status(400).json({code : 400, message : 'VILLAGE Not Found'})
  if(!post) return res.status(400).json({code : 400, message : 'POST Not Found'})
  if(!block) return res.status(400).json({code : 400, message : 'BLOCK Not Found'})
  if(!thana) return res.status(400).json({code : 400, message : 'THANA Not Found'})
  if(!district) return res.status(400).json({code : 400, message : 'DISTRICT Not Found'})
  if(!state) return res.status(400).json({code : 400, message : 'STATE Not Found'})
  if(!zipcode) return res.status(400).json({code : 400, message : 'Zipcode Not Found'})
  if(!validateAdhar(adhar_number)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  if(!validateAdhar(fa_adhar_num)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  if(!validateAdhar(mo_adhar_num)) return res.status(400).json({ code : 400, message : 'Adhar Number is Not Valid'})
  try {
    const status = await Birth.updateOne({
      _id : rec_id, author : user},{$set : {
      name,
    adhar_number,
    dob,
    dob_en,
    gen,
    pob,
    fa_name,
    fa_adhar_num,
    mo_name,
    mo_adhar_num,
    village,
    post,
    block,
    thana,
    district,
    state,
    zipcode
    }})
    if(status.modifiedCount && status.matchedCount){
      return res.json({
        updated : true,
        message : "Update Success "
      })
    }else {
      return res.json({
        updated : false,
        message : "No Anything Update"
      })
    }
  } catch (e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
});

// delete ......
router.delete('/delete/:id', authenticateToken,async (req , res )=> {
  const id = req.params.id;
  try {
    const status = await Birth.deleteOne({_id : id, author : req.user.username})
    if(status.acknowledged && status.deletedCount){
      return res.json({
        deleted : true,
        message : 'delete sucess'
      })
    }else{
      return res.status(404).json({
        deleted : false,
        message : 'No Record Found !'
      })
    }
  } catch (e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
})

// view routes .................
router.get('/view/birth/:id', async ( req, res ) => {
  let id = req.params.id;
  try {
    const data = await Birth.findOne({_id : id})
    if(!data) return res.status(404).json({message : "No Record Found !"})
    return res.render('viewbirth',data);
  } catch (e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
})
// print .... 
router.get('/print/birth/:id', async ( req, res ) => {
  let id = req.params.id;
  try{
    const data = await Birth.findOne({_id : id})
    if(!data) return res.status(404).json({message : "No Record Found !"})
    data.adhar_number = prefix.concat(data.adhar_number.substr(8));
    data.fa_adhar_num = prefix.concat(data.fa_adhar_num.substr(8));
    data.mo_adhar_num = prefix.concat(data.mo_adhar_num.substr(8));
    res.render('birth', data);
  }catch(e){
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
  })
// profile ......
router.get('/profile', authenticateToken, async (req,res)=>{
  try{
    const user = await User.findOne({username : req.user.username}, {password : 0})
    if(user){
      res.json({
        id : user.id,
        username : user.username,
        coins : user.coins
      })
    }else {
      res.status(404).json({
        code : 404,
        message : 'No User Found !'
      });
    }
  }catch(e) {
    return res.status(500).json({
    code : 500,
    message : "Server Error",
    e : e
    })
  }
})

// create user 
router.post('/create/user', async ( req, res)=>{
  const { myname } = req.headers;
  const { name, password } = req.body;
  if(!myname) return res.status(403).json({create : false});
  if(!name) return res.status(403).json({create : false});
  if(!password) return res.status(403).json({create : false});
  if( myname != 'armaan') return res.status(403).json({message : "Not a Valid User"})
  try {
    const usermodel = await new User({
      username : name,
      password : password,
      coins : 0
    }).save()
    return res.json(usermodel)
  } catch (e) {
    return res.json({
      error : true,
      message : e
    })
  }
})
// update user
router.post('/update/user/:id',async (req, res)=> {
  const { myname } = req.headers;
  const { coin } = req.body;
  const id = req.params.id;
  if(!myname) return res.status(403).json({create : false});
  if(!coin) return res.status(403).json({create : false});
  if(!id) return res.status(403).json({create : false});
  if( myname != 'armaan') return res.status(403).json({message : "Not a Valid User"})
  try {
    const cur_u = await User.findOne({_id : id}, {password : 0});
    const updated_u = await User.updateOne({_id : id}, {$set : { coins : coin}})
    return res.json(updated_u)
  } catch (e) {
    return res.status(403).json({error : true , message : e });
  }
  
})

export default router;

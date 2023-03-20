import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../db/db.js';
const router = express.Router();
// utils methods 
const validateAdhar = num => num.length==12
const prefix = 'XXXXXXXX';

// auth middelwere .......
function authenticateToken(req, res, next) {
  const {token} = req.headers || req.body;
  if (!token) return res.status(401).json({code : 401, message : "No Token Found ! Login First !!"})

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({code : 403, message : err.message});
    
    req.user = user
    next()
  })
}

// token Genrate method !
const genToken = (name) => {
  return jwt.sign({username : name}, process.env.TOKEN_SECRET, {'expiresIn' : '1d'})
}

// Login Logout......

router.post('/login', (req , res)=> {
  const { username , password } = req.body;
  if(!username || !password) {
    return res.status(402).json({
      code : 402,
      message : "Please Send username and password"
    })
  }
  for(var i =0; i<db.data.users.length;i++){
    if(db.data.users[i].username === username && db.data.users[i].password === password ){
      /*
        id : db.data.users[i].id,
        coins : db.data.users[i].coins,
        name : username,
      */
      return res.json({
        token : genToken(username)
      })
     // break;
    }
  }
  return res.status(403).json({
    code : 403,
    message : "UserName Or Password is Incorrect"
  })
})
router.post('/logout', authenticateToken ,(req, res)=> {
  res.json({
    status : 200,
    message : "You Are Logged Out"
  })
})

/* ******************************  */

// create .....
router.post('/newbirth',authenticateToken,(req, res)=> {
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
  
  // Here Check have coins or No
  for(var p=0;p<db.data.users.length;p++){
    if(db.data.users[p].username === req.user.username){
      let coin = Number(db.data.users[p].coins);
      if(coin >= 20){
        coin = coin - 20;
        db.data.users[p].coins = coin;
        db.write();
        break;
      }else{
        return res.json({
          created : false,
          message : "No Have Money! Please Add Money"
        })
      }
    }
  }
  
  
  
  const date = new Date();
  let x = date.toLocaleTimeString();
  x = x.replace('AM', '');
  x = x.replace('PM', '');
  x = x.trim()
  let tmpID = `B-${date.getFullYear()}: ${Math.floor(Math.random()*11)}-${Math.floor(Math.random()*99999)}-${Math.floor(Math.random()*999999)}`;
  db.data.birth.push({
    author: req.user.username,
    id : tmpID,
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
  })
  db.write();
  res.json({
    code : 200,
    message : "created",
    birthID : tmpID
  })
})

// read.....
router.get('/birthOrders', authenticateToken,(req, res) => {
  const tmp = [];
  for(var i=0; i<db.data.birth.length;i++){
    if(req.user.username === db.data.birth[i].author){
      tmp.push(db.data.birth[i]);
    }
  }
  res.json({
    user : req.user,
    data : tmp
  })
})

// update ...... 
router.post('/update/:id' , authenticateToken, (req, res)=> {
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
  for(var i=0;i<db.data.birth.length;i++){
    //console.log(db.data.birth[i].id)
    if(db.data.birth[i].id===rec_id && db.data.birth[i].author === user){
      let tmpbirth = db.data.birth[i];
      db.data.birth[i] = {author: tmpbirth.author,
      id: tmpbirth.id,
      date: tmpbirth.date,
      time: tmpbirth.time,
      ...req.body.data}
      db.write()
      return res.json({
        update : 'Ok',
        record : {author: tmpbirth.author,
        id: tmpbirth.id,
        date: tmpbirth.date,
        time: tmpbirth.time,
      ...req.body.data}
      });
    }
  }
  res.status(404).json({
    message : 'Not Found !',
    update : false
  });
});

// delete ......
router.delete('/delete/:id', authenticateToken, (req , res )=> {
  const id = req.params.id;
  const user = req.user.username;
  const newRecord = [];
  for(let i=0;i<db.data.birth.length;i++){
    if(db.data.birth[i].id === id && db.data.birth[i].author === user) {
      delete db.data.birth[i];
      for(let j=0;j<db.data.birth.length;j++){
        if(db.data.birth[j]){
          newRecord.push(db.data.birth[j])
        }
      }
      db.data.birth = newRecord;
      db.write();
      return res.json({
        message : 'delete',
        id,
      })
    }
  }
  return res.status(404).json({
    message : 'Not Found !',
    deleted : false
  });
})

// view routes .................
router.get('/view/birth/:id', ( req, res ) => {
  let id = req.params.id;
  for(var x = 0; x < db.data.birth.length; x++){
    if(id === db.data.birth[x].id){
      let tmp = db.data.birth[x];
      tmp.adhar_number = prefix.concat(tmp.adhar_number.substr(8));
      tmp.fa_adhar_num = prefix.concat(tmp.fa_adhar_num.substr(8));
      tmp.mo_adhar_num = prefix.concat(tmp.mo_adhar_num.substr(8));
      //return res.json(tmp)
      return res.render('viewbirth', db.data.birth[x])
      break;
    }
  }
  res.status(404).json({
      message : "No Record Found !"
  })
})

router.get('/print/birth/:id', ( req, res ) => {
  let id = req.params.id;
  for(var x = 0; x < db.data.birth.length; x++){
    if(id === db.data.birth[x].id){
      let tmp = db.data.birth[x];
      tmp.adhar_number = prefix.concat(tmp.adhar_number.substr(8));
      tmp.fa_adhar_num = prefix.concat(tmp.fa_adhar_num.substr(8));
      tmp.mo_adhar_num = prefix.concat(tmp.mo_adhar_num.substr(8));
      //return res.json(tmp)
      return res.render('birth', db.data.birth[x])
      break;
    }
  }
  res.status(404).json({
      message : "No Record Found !"
  })
})

router.get('/profile', authenticateToken, (req,res)=>{
  db.data.users.forEach( e => {
    if(e.username === req.user.username){
      return res.json({
        id : e.id,
        username : e.username,
        coins : e.coins
      })
    }
  })
})

// create user 
router.post('/create/user', ( req, res)=>{
  const { myname } = req.headers;
  const { name, password } = req.body;
  
  if(!myname) return res.status(403).json({create : false});
  if(!name) return res.status(403).json({create : false});
  if(!password) return res.status(403).json({create : false});
  if(myname === 'armaan'){
    const newuser = {
      id : db.data.users.length + 1,
      username : name,
      password : password,
      coins : 0
    }
    db.data.users.push(newuser);
    db.write()
    return res.json({
      id : newuser.id,
      username : newuser.username,
      coins : newuser.coins
    })
  }
  return res.status(403).send();
})
// update user
router.post('/update/user/:id', (req, res)=> {
  const { myname } = req.headers;
  const { coin } = req.body;
  const id = req.params.id;
  if(!myname) return res.status(403).json({create : false});
  if(!coin) return res.status(403).json({create : false});
  if(!id) return res.status(403).json({create : false});
  for(let n=0;n<db.data.users.length;n++){
    if(db.data.users[n].id == id){
      db.data.users[n].coins = coin;
      db.write()
      return res.json({
        id : db.data.users[n].id,
        coins : db.data.users[n].coins,
        user : db.data.users[n].username
      })
    }
  }
  return res.status(404).json({message : "No User Found !"});
})

// aadhar routes .....
/*
router.post('/newadhar', authenticateToken, (req, res)=> {
  const {} = req.body.data;
})
router.get('/view/adhar/:id', (req, res)=> {
  
})

 */

export default router;
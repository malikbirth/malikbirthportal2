import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.DB_URL



class Database{
  constructor(url){
    this.url = url;
    this._connect()
  }
  _connect(){
    mongoose.connect(this.url)
    .then( con => {
      console.log('DB Connected !')
    }).catch ( err => {
      console.log(err.message)
    })
  }
}

export default new Database(url);

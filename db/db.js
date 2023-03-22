import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/malikbirthportal';

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
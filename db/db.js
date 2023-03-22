import mongoose from 'mongoose';

const url = 'mongodb+srv://armanmalik:SX6fuHsWYsOQX0Au@cluster0.cjvoqmg.mongodb.net/malikbirthportal?retryWrites=true&w=majority';

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

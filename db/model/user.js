import {Schema , model} from 'mongoose';

const userSchema = new Schema({
  username : {
    type : String,
    required : true,
    unique : true,
    min : 4
  },
  password : {
    type : String,
    required : true,
    min : 6
  },
  coins : {
    type : Number,
    required : true
  }
})

export default model('users', userSchema)
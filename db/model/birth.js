import {Schema , model} from 'mongoose';

const BirthSchema = new Schema({
  author: {
    type : String,
    required : true
  },
  regisnum:{
    type : String,
    required : true,
    unique : true
  },
  date :{
    type : String,
    required : true
  },
  time : {
    type : String,
    required : true
  },
  name: {
    type : String,
    required : true
  },
  adhar_number : {
    type : String,
    required : true,
    min: 12,
    max : 12
  },
  dob : {
    type : String,
    required : true
  },
  dob_en : {
    type : String,
    required : true
  },
  gen : {
    type : String,
    required : true,
    default : 'MALE'
  },
  pob : {
    type : String,
    required : true
  },
  fa_name : {
    type : String,
    required : true
  },
  fa_adhar_num : {
    type : String,
    required : true,
    min : 12,
    max : 12
  },
  mo_name : {
    type : String,
    required : true
  },
  mo_adhar_num : {
    type : String,
    required : true,
    min : 12,
    max : 12
  },
  village : {
    type : String,
    required : true
  },
  district : {
    type : String,
    required : true
  },
  post : {
    type : String,
    required : true
  },
  block : {
    type : String,
    required : true
  },
  thana : {
    type : String,
    required : true
  },
  state : {
    type : String,
    required : true
  },
  zipcode : {
    type : String,
    required : true
  }
})

export default model('Birth',BirthSchema);
import mongoose from "mongoose";
const categoryschema=new mongoose.Schema({
    name:{type:String,required:true},
      image:{type:String,required:true},
    desc:{type:String,required:true}
},{timestamps:true})
const category=mongoose.model("category",categoryschema)
export default category
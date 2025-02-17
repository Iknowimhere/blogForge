import { Schema,model } from "mongoose";

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:"Blog",
        required:true
    }
},{timestamps:true})

export default model("Comment",commentSchema);